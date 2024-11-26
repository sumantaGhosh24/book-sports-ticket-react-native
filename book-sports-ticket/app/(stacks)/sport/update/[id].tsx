import {useEffect, useState} from "react";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ScrollView,
} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import {FontAwesome} from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-date-picker";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const UpdateSport = () => {
  const {id} = useLocalSearchParams();
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
  const [defaultCategory, setDefaultCategory] = useState();

  const [startDateShow, setStartDateShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDateShow, setEndDateShow] = useState(false);
  const [endDate, setEndDate] = useState<Date>(new Date());

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

  const getSport = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sport/${id}`);

      setForm({
        title: response.data.sport.title,
        description: response.data.sport.description,
        category: response.data.sport.category._id,
        location: response.data.sport.location,
        url: response.data.sport.url,
        price: response.data.sport.price,
      });
      setDefaultCategory(response.data.sport.category);
      setStartDate(
        response.data.sport.startDateTime
          ? new Date(response.data.sport.startDateTime)
          : new Date()
      );
      setEndDate(
        response.data.sport.endDateTime
          ? new Date(response.data.sport.endDateTime)
          : new Date()
      );
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
    getSport();
  }, [authState?.accesstoken]);

  const handleSubmit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      form.category === "" ||
      form.location === "" ||
      form.url === "" ||
      form.price === "" ||
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

      const response = await axios.put(
        `${BASE_URL}/sport/${id}`,
        {...form, startDateTime: startDate, endDateTime: endDate},
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
        getSport();
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
        <View className="h-full p-3">
          <Text className="text-2xl font-bold my-10 text-black dark:text-white">
            Update Sport
          </Text>
          <SelectDropdown
            data={categories}
            defaultValue={defaultCategory}
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
            title="Update Sport"
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

export default UpdateSport;
