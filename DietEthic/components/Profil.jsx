import { Text, SafeAreaView, Button} from "react-native";
export default function Nice ({navigation, route}){
    const {name, gender, age, Goal, dietaryRestrictions, favoriteCuisines} = route.params;
    return(
        <SafeAreaView>
            <Text> Profil Page</Text>
            <Text> Welcome {name}</Text>
        </SafeAreaView>
    );
}