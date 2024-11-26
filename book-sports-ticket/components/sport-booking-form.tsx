import {useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";

import {useAuth} from "@/context/auth-context";
import {RAZORPAY_KEY_ID} from "@/constants/config";
import {BASE_URL} from "@/constants";
import CustomButton from "@/components/custom-button";

interface SportBookingFormProps {
  id: string;
  price: string;
}

const SportBookingForm = ({id, price}: SportBookingFormProps) => {
  const [loading, setLoading] = useState(false);

  const {authState} = useAuth();

  const handleSubmit = async () => {
    if (price === "" || id === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/razorpay`,
        {price},
        {
          headers: {
            Authorization: `Bearer ${authState?.accesstoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === false) {
        return ToastAndroid.showWithGravityAndOffset(
          "Something went wrong, try again later!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      var options = {
        description: "Credits towards consultation",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: response.data.order.currency,
        key: RAZORPAY_KEY_ID,
        amount: response.data.order.amount,
        order_id: response.data.order.id,
        theme: {color: "#1D4ED8"},
        name: authState?.username!,
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          const res = await axios.post(
            `${BASE_URL}/verification`,
            {
              orderCreationId: response.data.order.id,
              razorpayPaymentId: data.razorpay_payment_id,
              razorpayOrderId: data.razorpay_order_id,
              razorpaySignature: data.razorpay_signature,
              sport: id,
              price: response.data.order.amount / 100,
            },
            {
              headers: {
                Authorization: `Bearer ${authState?.accesstoken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data.success === true)
            ToastAndroid.showWithGravityAndOffset(
              "Payment Success!",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
        })
        .catch((error) => {
          ToastAndroid.showWithGravityAndOffset(
            `${error.code} | ${error.description}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        });
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-3 border border-black dark:border-white m-4 rounded">
      <Text className="text-2xl font-bold text-black dark:text-white mb-5">
        Buy Sport Ticket
      </Text>
      <CustomButton
        title="Buy Sport Ticket"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 my-5"
        isLoading={loading}
      />
    </View>
  );
};

export default SportBookingForm;
