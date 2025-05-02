import React, { useEffect } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import { verifyKhaltiPayment } from '../../../axios/userApi';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../redux/cart/cartSlice';
const VerifyCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const query = new URLSearchParams(location.search);
    const pidx = query.get("pidx");
    const orderId = query.get("purchase_order_id");
    
    useEffect(() => {
        const verifyKhalti = async () => {
            try {
                const response = await verifyKhaltiPayment(pidx,orderId);
                
                if (response.data.success) {
                    dispatch(clearCart());
                    navigate("/user/myorders?success=true&orderId=" + orderId);
                }
                else {
                    navigate("/user/myorders?canceled=true&orderId=" + orderId);
                }
            } catch (error) {
                console.error('Error verifying Khalti payment:', error);
            }
        };

        verifyKhalti();
    },
    []);

  return (
    <></>
  )
}

export default VerifyCheckout