import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import axios from "axios";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import dotenv from "dotenv";
dotenv.config();

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("user", "name email")
    .populate("books.book", "title author price");
  if (!orders) {
    return res.status(404).json({ message: "No orders found" });
  }
  res.status(200).json(orders);
};

export const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(order);
};

export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.isCancelled = true;
  const cancelledOrder = await order.save();
  res.status(200).json(cancelledOrder);
};

export const placeOrderKhalti = async (req, res) => {
  const { books, totalPrice } = req.body;
  const userId = req.user._id;

  if (!books || books.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    // Create new Order
    const order = new Order({
      books,
      user: userId,
      paymentMethod: "Khalti",
      totalPrice,
    });
    const createdOrder = await order.save();

    const populatedOrder = await Order.findById(createdOrder._id).populate(
      "user",
      "name email phone"
    );

    const khaltiPayload = {
      return_url: `${process.env.CLIENT_URL}/user/verify-checkout`,
      website_url: `${process.env.CLIENT_URL}`,
      amount: totalPrice * 100, // Convert to paisa
      purchase_order_id: createdOrder._id.toString(),
      purchase_order_name: "Book Order",
      customer_info: {
        name: populatedOrder.user.name,
        email: populatedOrder.user.email,
        phone: populatedOrder.user.phone,
      },
    };

    const { data: khaltiResponse } = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      khaltiPayload,
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Order created and Khalti initiated",
      orderId: createdOrder._id,
      khaltiResponse,
    });
  } catch (err) {
    console.error("Khalti Order Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body;

    const { data: khaltiResponse } = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const update =
      khaltiResponse.status === "Completed"
        ? { isPaid: true, isCompleted: true }
        : { isCancelled: true, paymentResult: khaltiResponse };

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      update,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      const newBookIds = updatedOrder.books.map((item) => item.book.toString());

      // Combine old + new while avoiding duplicates
      const uniqueBooks = new Set([
        ...user.ownedBooks.map((id) => id.toString()),
        ...newBookIds,
      ]);

      user.ownedBooks = Array.from(uniqueBooks);
      await user.save();
    }

    res.status(200).json({
      success: khaltiResponse.status === "Completed",
      message:
        khaltiResponse.status === "Completed"
          ? "Payment successful"
          : "Payment failed",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Khalti Verify Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create order + Stripe session
export const placeOrderStripe = async (req, res, next) => {
  try {
    const { books, totalPrice } = req.body;
    const userId = req.user._id;
    const { origin } = req.headers;

    if (!books || books.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Create new Order
    const order = new Order({
      books,
      user: userId,
      paymentMethod: "Stripe",
      totalPrice,
    });
    const createdOrder = await order.save();

    // Stripe line items
    const lineItems = books.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/myorders?success=true&orderId=${createdOrder._id}`,
      cancel_url: `${origin}/myorders?canceled=true`,
      metadata: {
        orderId: createdOrder._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    next(err);
  }
};

// Stripe webhook to update payment status
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId; // Get userId from metadata

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true; // Mark the order as paid
        await order.save();

        // Add the books to the user's ownedBooks
        const user = await User.findById(userId);
        if (user) {
          // Get book IDs from the order
          const newBookIds = order.books.map((item) => item.book.toString());

          // Combine old + new while avoiding duplicates
          const uniqueBooks = new Set([
            ...user.ownedBooks.map((id) => id.toString()),
            ...newBookIds,
          ]);

          user.ownedBooks = Array.from(uniqueBooks);
          await user.save();
        }
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    }
  }

  // Handle canceled payment (when session expires or is canceled)
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.isCancelled = true; // Mark the order as cancelled
        await order.save();
      }
    } catch (err) {
      console.error("Error updating order cancellation:", err.message);
    }
  }

  // Respond with a success status
  res.status(200).json({ received: true });
};
