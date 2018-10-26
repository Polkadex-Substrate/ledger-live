/* @flow */
import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import type { NavigationScreenProp } from "react-navigation";
import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";

import { getAccountBridge } from "../../bridge";
import { accountScreenSelector } from "../../reducers/accounts";

import LText from "../../components/LText";
import Stepper from "../../components/Stepper";
import StepHeader from "../../components/StepHeader";

import colors from "../../colors";

type Props = {
  account: Account,
  navigation: NavigationScreenProp<{
    accountId: string,
    address: string,
    amount: string,
    fees: number,
  }>,
};

type State = {
  signed: boolean,
  result: ?Operation,
  error: ?Error,
};

class Validation extends Component<Props, State> {
  static navigationOptions = {
    headerTitle: <StepHeader title="Device" subtitle="step 6 of 6" />,
  };

  state = {
    signed: false,
    result: null,
    error: null,
  };

  sign() {
    const {
      account,
      navigation: {
        state: {
          // $FlowFixMe
          params: { address, amount, deviceId, ...rest },
        },
      },
    } = this.props;
    const bridge = getAccountBridge(account);
    let transaction = bridge.createTransaction(account);
    transaction = bridge.editTransactionParameters(account, transaction, {
      address,
      amount: new BigNumber(amount),
      ...rest,
    });
    bridge.signAndBroadcast(account, transaction, deviceId).subscribe({
      next: e => {
        switch (e.type) {
          case "signed":
            this.setState({ signed: true });
            break;
          case "broadcasted":
            this.setState({ result: e.operation });
            break;
          default:
        }
      },
      error: error => {
        this.setState({ error });
      },
    });
  }

  render() {
    const { result, error, signed } = this.state;
    return (
      <View style={styles.root}>
        <Stepper nbSteps={6} currentStep={6} />
        {result ? (
          <LText>well done! {result.hash}</LText>
        ) : error ? (
          <LText>ERROR! {String(error)}</LText>
        ) : signed ? (
          <ActivityIndicator />
        ) : (
          <LText>Please validate transaction on your device...</LText>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const mapStateToProps = (state, props) => ({
  account: accountScreenSelector(state, props),
});

export default connect(mapStateToProps)(Validation);
