import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {router} from "expo-router";
import axios from "axios";
import {FontAwesome} from "@expo/vector-icons";
import {Row, Table} from "react-native-table-component";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import IconButton from "@/components/icon-button";

interface BookingProps {
  count: number;
  bookings: {
    _id: string;
    buyer: {
      _id: string;
      username: string;
      email: string;
    };
    sport: {
      _id: string;
      title: string;
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
  }[];
  success: boolean;
}

const ManageBookings = () => {
  const {authState} = useAuth();

  const [filter, setFilter] = useState({
    page: 1,
    sort: "-createdAt",
  });
  const [bookings, setBookings] = useState<BookingProps>();
  const [refreshing, setRefreshing] = useState(false);

  const getBookings = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/bookings?page=${filter.page}&sort=${filter.sort}`,
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      setBookings(response.data);
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
    getBookings();
  }, [filter, authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getBookings();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "User",
      "Sport",
      "Order Status",
      "Price",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200],
  });

  return (
    <View className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        {bookings?.bookings?.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No bookings found.
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
              marginTop: 20,
              borderRadius: 7,
            }}
          >
            <Text className="mb-5 text-xl font-bold">All Bookings</Text>
            <ScrollView horizontal={true} className="mb-5">
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                  <Row
                    data={data.tableHead}
                    widthArr={data.widthArr}
                    style={{height: 40, backgroundColor: "#1D4ED8"}}
                    textStyle={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white",
                    }}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                    {bookings?.bookings
                      ?.map((booking) => [
                        booking._id,
                        <View>
                          <Text>{booking.buyer.username}</Text>
                          <Text>{booking.buyer.email}</Text>
                        </View>,
                        <View>
                          <Text>{booking.sport.title}</Text>
                        </View>,
                        booking.orderStatus,
                        booking.price,
                        new Date(booking.createdAt).toLocaleDateString(),
                        new Date(booking.updatedAt).toLocaleDateString(),
                        <View>
                          <IconButton
                            icon={
                              <FontAwesome
                                name="pencil"
                                size={24}
                                color="white"
                              />
                            }
                            containerStyles="bg-[#1ac50e] mr-3 max-w-[32px] ml-10"
                            handlePress={() =>
                              router.push(`/booking/update/${booking._id}`)
                            }
                          />
                        </View>,
                      ])
                      ?.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={data.widthArr}
                          style={{height: 100, backgroundColor: "#E7E6E1"}}
                          textStyle={{
                            margin: 6,
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        />
                      ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
        {bookings?.count && bookings?.count > 0 ? (
          <View className="flex flex-row items-center gap-3 mb-48 flex-wrap mt-5">
            {[...Array(Math.ceil(bookings?.count / 10))].fill(0).map((c, i) => (
              <TouchableOpacity
                key={i + 1}
                onPress={() => setFilter({...filter, page: i + 1})}
                className={`p-3 rounded ${
                  i + 1 === filter.page
                    ? "bg-blue-700"
                    : "bg-black dark:bg-white"
                }`}
              >
                <Text className="font-bold text-white dark:text-black">
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};

export default ManageBookings;
