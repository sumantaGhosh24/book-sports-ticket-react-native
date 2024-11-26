import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Drawer} from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {router} from "expo-router";

import {Role, useAuth} from "@/context/auth-context";

const DrawerLayout = () => {
  const {onLogout, authState} = useAuth();

  const logout = () => {
    onLogout!();

    router.replace("/login");
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        initialRouteName="home"
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label="Logout" onPress={logout} />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          name="home"
          options={{drawerLabel: "Home", title: "Home"}}
          redirect={authState?.accesstoken === null}
        />
        <Drawer.Screen
          name="my-bookings"
          options={{drawerLabel: "My Bookings", title: "My Bookings"}}
          redirect={authState?.accesstoken === null}
        />

        <Drawer.Screen
          name="dashboard"
          options={{drawerLabel: "Dashboard", title: "Dashboard"}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Drawer.Screen
          name="manage-category"
          options={{drawerLabel: "Manage Category", title: "Manage Category"}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Drawer.Screen
          name="manage-sports"
          options={{drawerLabel: "Manage Sports", title: "Manage Sports"}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Drawer.Screen
          name="manage-bookings"
          options={{drawerLabel: "Manage Bookings", title: "Manage Bookings"}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Drawer.Screen
          name="manage-users"
          options={{drawerLabel: "Manage Users", title: "Manage Users"}}
          redirect={authState?.role !== Role.ADMIN}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
