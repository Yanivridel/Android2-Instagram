import { useEffect, useState } from "react";
import { FirebaseAuth } from "@/FirebaseConfig";
import { getUserByEmail } from "@/utils/api/internal/userApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlices";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import OverlayLoading from "@/components/OverlayLoading";
import { getToken } from "@/utils/authStorage";

export const ReduxInitializer = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged(async (user: any) => {
        if (user) {
            console.log("User is logged in:", user.email);
            const loggedUser = await getUserByEmail({ userEmail: user.email });    
            // console.log("loggedUser", loggedUser);
            if (loggedUser) {
                dispatch(setUser(loggedUser));
                navigation.navigate("MainApp", { screen: "Home" });
            }
        } else {
            console.log("User not logged in");
        }
        
        setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    return loading ? <OverlayLoading /> : null;
};
