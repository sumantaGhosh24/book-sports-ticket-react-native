import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-date-picker";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL, CLOUDINARY_URL} from "@/constants";
import {UPLOAD_PRESET} from "@/constants/config";
import {useAuth} from "@/context/auth-context";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const CreateSport = () => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    url: "",
    price: "",
  });
  const [startDateShow, setStartDateShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDateShow, setEndDateShow] = useState(false);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [image, setImage] = useState<any>();

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);

      setCategories(response.data.categories);
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
    getCategories();
  }, [authState?.accesstoken]);

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setImage({
      uri: pickerResult.assets[0].uri,
      type: pickerResult.assets[0].mimeType,
      name: pickerResult.assets[0].fileName,
    });
  };

  const handleSubmit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      form.category === "" ||
      form.location === "" ||
      form.url === "" ||
      form.price === "" ||
      !image ||
      !startDate ||
      !endDate
    ) {
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

      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", UPLOAD_PRESET);

      const imageResponse = await axios.post(CLOUDINARY_URL, data, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      const response = await axios.post(
        `${BASE_URL}/sport`,
        {
          ...form,
          image: {
            url: imageResponse.data.secure_url,
            public_id: imageResponse.data.public_id,
          },
          startDateTime: startDate,
          endDateTime: endDate,
        },
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        router.push("/manage-sports");
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
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex justify-center px-4">
          <Text className="text-2xl font-bold my-10 text-black dark:text-white">
            Create Sport
          </Text>
          <View className="my-5 space-y-2">
            <Text className="text-base font-bold text-black dark:text-white">
              Sport Image
            </Text>
            <TouchableOpacity onPress={() => openPicker()}>
              {image?.uri ? (
                <Image
                  source={{uri: image?.uri}}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 rounded-2xl border-2 bg-gray-700 flex justify-center items-center flex-row space-x-2">
                  <FontAwesome5
                    name="cloud-upload-alt"
                    size={24}
                    color="white"
                  />
                  <Text className="text-sm font-bold text-white">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <SelectDropdown
            data={categories}
            onSelect={(selectedItem) => {
              setForm({...form, category: selectedItem._id});
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem._id) || "Select a category"}
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
                  <Image
                    source={{uri: item.image.url}}
                    resizeMode="cover"
                    className="h-10 w-10 rounded-full mr-2"
                  />
                  <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <FormField
            title="Sport Title"
            placeholder="Enter sport title"
            value={form.title}
            handleChangeText={(text: any) => setForm({...form, title: text})}
            otherStyles="mb-3"
            autoComplete="name"
            keyboardType="default"
          />
          <FormField
            title="Sport Description"
            placeholder="Enter sport description"
            value={form.description}
            handleChangeText={(text: any) =>
              setForm({...form, description: text})
            }
            otherStyles="mb-3"
            custom={true}
            autoComplete="name"
            keyboardType="default"
          />
          <FormField
            title="Sport Ticket Price"
            placeholder="Enter sport ticket price"
            value={form.price}
            handleChangeText={(text: any) => setForm({...form, price: text})}
            otherStyles="mb-3"
            autoComplete="name"
            keyboardType="numeric"
          />
          <FormField
            title="Sport Location"
            placeholder="Enter sport location"
            value={form.location}
            handleChangeText={(text: any) => setForm({...form, location: text})}
            otherStyles="mb-3"
            autoComplete="country"
            keyboardType="default"
          />
          <FormField
            title="Sport Website Url"
            placeholder="Enter website url"
            value={form.url}
            handleChangeText={(text: any) => setForm({...form, url: text})}
            otherStyles="mb-3"
            autoComplete="name"
            keyboardType="default"
          />
          <CustomButton
            handlePress={() => setStartDateShow(true)}
            title="Start Date Time"
            containerStyles="bg-blue-700 mb-5"
          />
          <CustomButton
            handlePress={() => setEndDateShow(true)}
            title="End Date Time"
            containerStyles="bg-blue-700 mb-5"
          />
          <DatePicker
            modal
            open={startDateShow}
            date={startDate}
            onConfirm={(date) => {
              setStartDateShow(false);
              setStartDate(date);
            }}
            onCancel={() => {
              setStartDateShow(false);
            }}
            minimumDate={new Date()}
            mode="datetime"
          />
          <DatePicker
            modal
            open={endDateShow}
            date={endDate}
            onConfirm={(date) => {
              setEndDateShow(false);
              setEndDate(date);
            }}
            onCancel={() => {
              setEndDateShow(false);
            }}
            minimumDate={new Date()}
            mode="datetime"
          />
          <Text>
            Sport Start Date Time:{" "}
            {startDate &&
              startDate.toLocaleDateString() +
                " " +
                startDate.toLocaleTimeString()}
          </Text>
          <Text className="mb-5">
            Sport End Date Time:{" "}
            {endDate &&
              endDate.toLocaleDateString() + " " + endDate.toLocaleTimeString()}
          </Text>
          <CustomButton
            title="Create Sport"
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
    textTransform: "capitalize",
  },
  dropdownItemIconStyle: {
    fontSize: 24,
    marginRight: 8,
  },
});

export default CreateSport;
