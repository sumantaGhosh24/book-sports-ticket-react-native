import {useEffect, useState} from "react";
import {Image, ScrollView, Text, ToastAndroid, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";

import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";

interface BookingProps {
  _id: string;
  buyer: {
    _id: string;
    username: string;
    email: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  sport: {
    _id: string;
    title: string;
    description: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  orderStatus: "pending" | "completed" | "cancelled" | "refund";
  price: string;
  createdAt: any;
  updatedAt: any;
}

const BookingDetails = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [booking, setBooking] = useState<BookingProps>();

  const getBooking = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/booking/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      if (response.data.success === true) {
        setBooking(response.data.booking);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  useEffect(() => {
    getBooking();
  }, [authState?.accesstoken]);

  return (
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="w-full px-4">
          <View className="flex flex-row items-center my-5">
            <Text className="text-2xl font-bold mr-5 text-black dark:text-white">
              Booking Details
            </Text>
            <CustomButton
              title="My Bookings"
              containerStyles="bg-blue-700"
              handlePress={() => router.push("/my-bookings")}
            />
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Booking Id:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {booking?._id}
            </Text>
          </View>
          <View className="my-5">
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Buyer:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: booking?.buyer?.image?.url}}
                alt={booking?.buyer?.image?.public_id}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <View>
                <Text className="font-bold text-black dark:text-white">
                  {booking?.buyer?.email}
                </Text>
                <Text className="font-light text-black dark:text-white">
                  {booking?.buyer?.username}
                </Text>
              </View>
            </View>
          </View>
          <View className="mb-5">
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Sport:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: booking?.sport?.image?.url}}
                alt={booking?.sport?.image?.public_id}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <View>
                <Text className="text-capitalize font-bold text-black dark:text-white">
                  {booking?.sport?.title}
                </Text>
                <Text className="text-capitalize font-light text-black dark:text-white">
                  {booking?.sport?.description}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Booking Price:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {booking?.price}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Order Status:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {booking?.orderStatus}
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center my-3">
            <Text className="text-base text-black dark:text-white font-bold">
              Created At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(booking?.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center mb-5">
            <Text className="text-base text-black dark:text-white font-bold">
              Updated At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(booking?.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;
