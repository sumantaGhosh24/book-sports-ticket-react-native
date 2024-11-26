import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import {router} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {Row, Table} from "react-native-table-component";
import CryptoJS from "crypto-js";

import {BASE_URL, CLOUDINARY_DESTROY_URL} from "@/constants";
import {CLOUD_API_KEY, CLOUD_API_SECRET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";
import IconButton from "@/components/icon-button";
import CustomButton from "@/components/custom-button";

interface SportTypes {
  count: number;
  sports: {
    _id: string;
    organizer: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      image: {
        url: string;
        public_id: string;
      };
    };
    category: {
      _id: string;
      name: string;
      image: {
        url: string;
        public_id: string;
      };
    };
    title: string;
    description: string;
    location: string;
    image: {
      url: string;
      public_id: string;
    };
    startDateTime: any;
    endDateTime: any;
    url: string;
    price: string;
    createdAt: any;
    updatedAt: any;
  }[];
  success: boolean;
}

const ManageSports = () => {
  const {authState} = useAuth();

  const [filter, setFilter] = useState({
    page: 1,
    sort: "-createdAt",
  });
  const [sports, setSports] = useState<SportTypes>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSports = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sports?page=${filter.page}&sort=${filter.sort}`
      );

      setSports(response.data);
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
    getSports();
  }, [filter, authState?.accesstoken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getSports();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Title",
      "Description",
      "Image",
      "Category",
      "Organizer",
      "Location",
      "Start Date Time",
      "End Date Time",
      "Url",
      "Price",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [
      200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
    ],
  });

  const handleDelete = async (id: string, imageId: string) => {
    if (!id || !imageId) return;

    try {
      setLoading(true);

      const response = await axios.delete(`${BASE_URL}/sport/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${imageId}&timestamp=${timestamp}${CLOUD_API_SECRET}`;
        const signature = CryptoJS.SHA1(signatureString).toString();
        const data = {
          public_id: imageId,
          api_key: CLOUD_API_KEY,
          timestamp,
          signature,
        };
        await axios.post(CLOUDINARY_DESTROY_URL, data);

        getSports();
      }
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
    <View className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        <CustomButton
          containerStyles="bg-blue-700 my-5"
          title="Create Sport"
          handlePress={() => router.push("/sport/create")}
        />
        {sports?.sports?.length === 0 ? (
          <Text className="text-center font-bold text-xl text-black dark:text-white mt-5">
            No sports found.
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
            <Text className="mb-5 text-xl font-bold">All Sports</Text>
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
                    {sports?.sports
                      ?.map((sport) => [
                        sport._id,
                        sport.title,
                        sport.description,
                        <Image
                          source={{uri: sport.image.url!}}
                          alt={sport.image.public_id!}
                          className="h-[60px] max-w-[100px] rounded ml-[50px]"
                          resizeMode="cover"
                        />,
                        <View className="flex flex-row items-center ml-3">
                          <Image
                            source={{uri: sport.category.image.url}}
                            className="mr-3 h-[50px] w-[50px] rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {sport.category.name}
                          </Text>
                        </View>,
                        <View className="flex flex-row items-center ml-3">
                          <Image
                            source={{uri: sport.organizer.image.url}}
                            className="mr-3 h-[50px] w-[50px] rounded"
                            resizeMode="cover"
                          />
                          <View>
                            <Text className="font-bold">
                              {sport.organizer.firstName}{" "}
                              {sport.organizer.lastName}
                            </Text>
                            <Text className="font-bold">
                              {sport.organizer.username}
                            </Text>
                          </View>
                        </View>,
                        sport.location,
                        new Date(sport.startDateTime).toLocaleDateString() +
                          " " +
                          new Date(sport.startDateTime).toLocaleTimeString(),
                        new Date(sport.endDateTime).toLocaleDateString() +
                          " " +
                          new Date(sport.endDateTime).toLocaleTimeString(),
                        sport.url,
                        sport.price,
                        new Date(sport.createdAt).toLocaleDateString(),
                        new Date(sport.updatedAt).toLocaleDateString(),
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon={
                              <FontAwesome name="eye" size={24} color="white" />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#1D4ED8] mr-3"
                            handlePress={() =>
                              router.push(`/sport/details/${sport._id}`)
                            }
                          />
                          <IconButton
                            icon={
                              <FontAwesome
                                name="pencil"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#1ac50e] mr-3"
                            handlePress={() =>
                              router.push(`/sport/update/${sport._id}`)
                            }
                          />
                          <IconButton
                            icon={
                              <FontAwesome
                                name="trash"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#e10a11]"
                            handlePress={() =>
                              handleDelete(sport._id, sport.image.public_id)
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
        {sports?.count && sports?.count > 0 ? (
          <View className="flex flex-row items-center gap-3 mb-48 flex-wrap mt-10">
            {[...Array(Math.ceil(sports?.count / 10))].fill(0).map((c, i) => (
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

export default ManageSports;
