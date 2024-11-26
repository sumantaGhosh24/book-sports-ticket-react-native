import {useEffect, useState} from "react";
import {
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  StyleSheet,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";

import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {FontAwesome} from "@expo/vector-icons";

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

const statusData = [
  {title: "pending"},
  {title: "completed"},
  {title: "cancelled"},
  {title: "refund"},
];

const UpdateBooking = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [booking, setBooking] = useState<BookingProps>();
  const [orderStatus, setOrderStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const getBooking = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/booking/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      if (response.data.success === true) {
        setBooking(response.data.booking);
        setOrderStatus(response.data.booking?.orderStatus);
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

  const handleSubmit = async () => {
    if (orderStatus === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/booking`,
        {id, orderStatus: orderStatus},
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      getBooking();
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
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="w-full px-4">
          <View className="flex flex-row items-center my-5">
            <Text className="text-2xl font-bold mr-5 text-black dark:text-white">
              Booking Details
            </Text>
            <CustomButton
              title="Manage Bookings"
              containerStyles="bg-blue-700"
              handlePress={() => router.push("/manage-bookings")}
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
        <View className="w-full px-4">
          <SelectDropdown
            data={statusData}
            defaultValue={{title: booking?.orderStatus}}
            onSelect={(selectedItem) => {
              setOrderStatus(selectedItem.title);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) ||
                      "Select booking status"}
                  </Text>
                  <FontAwesome
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: "#D2D9DF"}),
                  }}
                >
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <CustomButton
            title="Update Booking Status"
            handlePress={handleSubmit}
            containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 24,
    marginRight: 8,
  },
});

export default UpdateBooking;
