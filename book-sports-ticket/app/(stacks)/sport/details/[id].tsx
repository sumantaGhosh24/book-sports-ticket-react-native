import {useState, useEffect} from "react";
import {View, Text, ToastAndroid, Image, ScrollView} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import CustomButton from "@/components/custom-button";
import SportBookingForm from "@/components/sport-booking-form";

interface SportTypes {
  _id: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
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
}

const SportDetails = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [sport, setSport] = useState<SportTypes>();

  const getSport = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sport/${id}`);

      if (response.data.success === true) {
        setSport(response.data.sport);
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
    getSport();
  }, [authState?.accesstoken]);

  return (
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="w-full px-4">
          <View className="flex flex-row items-center my-5">
            <Text className="text-2xl font-bold mr-5 text-black dark:text-white">
              Sport Details
            </Text>
            {authState?.role === "admin" ? (
              <CustomButton
                title="Sports"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/manage-sports")}
              />
            ) : (
              <CustomButton
                title="Home"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/home")}
              />
            )}
          </View>
          <View className="">
            <Image
              source={{uri: sport?.image?.url}}
              alt={sport?.image?.public_id}
              resizeMode="cover"
              className="h-[200px] w-full rounded"
            />
          </View>
          <Text className="text-xl font-bold capitalize text-black dark:text-white my-3">
            {sport?.title}
          </Text>
          <Text className="text-lg font-medium capitalize text-black dark:text-white">
            {sport?.description}
          </Text>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport Id:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {sport?._id}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport Start Date Time:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {new Date(sport?.startDateTime).toLocaleDateString()}{" "}
              {new Date(sport?.startDateTime).toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport End Date Time:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {new Date(sport?.endDateTime).toLocaleDateString()}{" "}
              {new Date(sport?.endDateTime).toLocaleTimeString()}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport Ticket Price:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {sport?.price}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2 my-3">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport Location:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {sport?.location}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-black dark:text-white text-sm font-bold">
              Sport Website Url:
            </Text>
            <Text className="text-black dark:text-white text-sm">
              {sport?.url}
            </Text>
          </View>
          <View className="my-3">
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Organizer:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: sport?.organizer?.image?.url}}
                alt={sport?.organizer?.image?.public_id}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <View>
                <Text className="font-bold text-black dark:text-white">
                  {sport?.organizer?.firstName}
                </Text>
                <Text className="font-bold text-black dark:text-white">
                  {sport?.organizer?.lastName}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-sm font-bold text-black dark:text-white mb-3">
              Category:{" "}
            </Text>
            <View className="flex flex-row items-center gap-3">
              <Image
                source={{uri: sport?.category.image.url}}
                resizeMode="cover"
                className="h-16 w-16 rounded mr-3"
              />
              <Text className="text-capitalize font-bold text-black dark:text-white">
                {sport?.category.name}
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-2 items-center my-3">
            <Text className="text-base text-black dark:text-white font-bold">
              Created At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(sport?.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center mb-5">
            <Text className="text-base text-black dark:text-white font-bold">
              Updated At
            </Text>
            <Text className="text-base text-black dark:text-white">
              {new Date(sport?.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {sport?.startDateTime &&
        new Date().getTime() < new Date(sport?.startDateTime).getTime() ? (
          sport?._id &&
          sport?.price && (
            <SportBookingForm id={sport!._id} price={sport!.price} />
          )
        ) : (
          <Text className="text-xl font-bold text-center mb-10 text-black dark:text-white">
            The Sport Is Completed
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SportDetails;
