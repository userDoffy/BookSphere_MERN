import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { clearCart } from "../../../redux/cart/cartSlice";
import { Table, Button } from "react-bootstrap";
import { FaCcStripe, FaKickstarter } from "react-icons/fa";
import { SiCoil } from "react-icons/si";
import { loadStripe } from "@stripe/stripe-js";
import toast, { Toaster } from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import { placeOrderStripe,placeOrderKhalti } from "../../../axios/userApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // or process.env for CRA

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { name } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const books = items.map((item) => ({
        title: item.title,
        price: item.price,
        book: item.id,
      }));
      
      const res = await placeOrderStripe(books, totalAmount);

      const { sessionId } = res.data; // Correcting this to 'res.data.sessionId'
      
      toast.success("Redirecting to payment...");
      dispatch(clearCart());
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error(err);
      toast.error("Stripe checkout failed");
    }
  };

  const handleKhaltiCheckout = async () => {
    try {
      const books = items.map((item) => ({
        title: item.title,
        price: item.price,
        book: item.id,
      }));
      const res = await placeOrderKhalti(books, totalAmount);

      window.location.href=res.data.khaltiResponse.payment_url
    } catch (err) {
      console.error(err);
      toast.error("Khalti checkout failed");
    }
  };

  return (
    <div className="container py-4">
      <Toaster />
      <h4 className="mb-4">Checkout Summary</h4>

      {items.length === 0 ? (
        <div className="text-center text-muted">Your cart is empty.</div>
      ) : (
        <>
          <Table bordered responsive className="shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Book</th>
                <th>Price</th>
                <th>Buyer</th>
              </tr>
            </thead>
            <tbody>
              {items.map((book, idx) => (
                <tr key={idx}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      style={{
                        width: "50px",
                        height: "75px",
                        objectFit: "cover",
                      }}
                    />
                    <span>{book.title}</span>
                  </td>
                  <td>$ {book.price}</td>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-3 fw-bold">Total Amount: Rs. {totalAmount}</div>

          <h5 className="mt-4">Choose Payment Method</h5>
          <div className="d-flex flex-wrap gap-3 mt-3 align-items-center justify-content-center">
            <Button
              variant="dark"
              className="d-flex align-items-center gap-2 px-3"
              onClick={handleStripeCheckout}
            >
              <FaCcStripe size={20} />
              Stripe
            </Button>
            <Button
              variant="success"
              className="d-flex align-items-center gap-2 px-3"
              disabled
            >
              <SiCoil size={20} />
              eSewa
            </Button>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2 px-3"
              style={{ backgroundColor: "#5e338d", border: "none" }}
              onClick={handleKhaltiCheckout}
            >
              <FaKickstarter size={20} />
              Khalti
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
