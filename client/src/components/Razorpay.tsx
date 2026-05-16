import { useCallback } from "react";
import { config } from "../../env.config";
import { paymentApi } from "../api";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type RazorpayProps = {
  className: string
  order: {
    amount: number;
    session_id: string;
  };
  onSuccess?: (response: string) => void;
  buttonText?: string;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

function Razorpay({
  className,
  order,
  onSuccess,
  buttonText = "Pay Now",
}: RazorpayProps) {

  const loadScript = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {

      const existingScript = document.querySelector(
        `script[src="${src}"]`
      );

      // prevent duplicate script loading
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = src;
      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }, []);

  const handlePayment = async () => {

    const loaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const orderResponse = await paymentApi.createOrder(order.amount, order.session_id);
      
    const options = {
      key: config.razorpayApiKey,
      amount: orderResponse.amount,
      order_id: orderResponse.order_id,
      currency: "INR",
      name: "BookMyScreen - Movie Booking App",

      handler: async function (response: RazorpayResponse) {
        try {
          await paymentApi.verifyPayment(response.razorpay_order_id!, response.razorpay_payment_id, response.razorpay_signature!);
        } catch (err: unknown) {
          alert("Payment verification failed: " + err);
          return;
        }
        console.log("Payment Success", response);
        onSuccess?.(response?.razorpay_payment_id);
      },

      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  return (
    <button className={className} onClick={handlePayment}>
      {buttonText}
    </button>
  );
}

export default Razorpay;