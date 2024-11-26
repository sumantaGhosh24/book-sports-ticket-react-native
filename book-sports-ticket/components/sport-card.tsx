import {View, Text, Image, Dimensions} from "react-native";
import {router} from "expo-router";

import CustomButton from "./custom-button";

interface SportCardProps {
  id: string;
  img: string;
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  startDateTime: any;
  endDateTime: any;
}

const SportCard = ({
  id,
  img,
  title,
  description,
  category,
  price,
  location,
  startDateTime,
  endDateTime,
}: SportCardProps) => {
  const width = Dimensions.get("screen").width;

  return (
    <View className="bg-white dark:bg-black border-2 border-black dark:border-white rounded p-4 mb-5 min-w-full">
      <Image
        source={{uri: img}}
        className={`w-[${width}] h-[200px] rounded z-50`}
        resizeMode="cover"
      />
      <Text className="text-xl capitalize font-bold text-black dark:text-white my-3">
        {title}
      </Text>
      <Text className="text-lg capitalize font-semibold text-black dark:text-white">
        {description}
      </Text>
      <Text className="bg-blue-700 font-extrabold text-white p-2 rounded-md uppercase max-w-[45%] my-3">
        {category}
      </Text>
      <Text className="text-black dark:text-white font-extrabold">
        INR: {price}
      </Text>
      <Text className="text-black dark:text-white font-extrabold">
        Location: {location}
      </Text>
      <Text className="text-black dark:text-white font-extrabold">
        Start Date & Time: {new Date(startDateTime).toLocaleDateString()}{" "}
        {new Date(startDateTime).toLocaleTimeString()}
      </Text>
      <Text className="text-black dark:text-white font-extrabold">
        End Date & Time: {new Date(endDateTime).toLocaleDateString()}{" "}
        {new Date(endDateTime).toLocaleTimeString()}
      </Text>
      {new Date().getTime() > new Date(startDateTime).getTime() && (
        <Text className="text-2xl font-bold my-5 text-black dark:text-white">
          This Sport Is Over
        </Text>
      )}
      <CustomButton
        title="View Details"
        containerStyles="bg-blue-700 mt-5"
        handlePress={() => router.push(`/sport/details/${id}`)}
      />
    </View>
  );
};

export default SportCard;
