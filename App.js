import React from "react";
import { Text } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigation from "./src/navigation/AppNavigation";
import reduxStore from "./store";
import { StripeProvider } from "@stripe/stripe-react-native";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const App = () => {
  const { store, persistor } = reduxStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider publishableKey="pk_test_51KGRe2KsJdcOoZ6YSClyPlg3VfrLV0XprFomhM8QWz1yl5L4DIO8Wi5QqhVIOc0SUHtYfjD3gjC1QNb1N7CGMuVL00kBiYntpO">
          <AppNavigation />
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
};

// const {store, persistor} = reduxStore()
//   return(
//     <Provider store={store}>
//       <PersistGate loading={false} persistor={persistor}>
//         <AppNavigation />
//       </PersistGate>
//     </Provider>
//   )
// }

export default App;