// @flow

import logger from 'logger'
import invariant from 'invariant'
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { T, Device } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import { getBridgeForCurrency } from 'bridge'

import { accountsSelector } from 'reducers/accounts'
import { updateAccountWithUpdater } from 'actions/accounts'

import PollCounterValuesOnMount from 'components/PollCounterValuesOnMount'

import Breadcrumb from 'components/Breadcrumb'
import { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import PrevButton from 'components/modals/PrevButton'
import StepConnectDevice from 'components/modals/StepConnectDevice'
import ChildSwitch from 'components/base/ChildSwitch'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'
import SyncOneAccountOnMount from 'components/SyncOneAccountOnMount'

import Footer from './Footer'
import ConfirmationFooter from './ConfirmationFooter'

import StepAmount from './01-step-amount'
import StepVerification from './03-step-verification'
import StepConfirmation from './04-step-confirmation'

const noop = () => {}

type Props = {
  initialAccount: ?Account,
  onClose: () => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  accounts: Account[],
  t: T,
}

type State<T> = {
  account: Account,
  transaction: ?T,
  bridge: ?WalletBridge<T>,
  stepIndex: number,
  appStatus: ?string,
  deviceSelected: ?Device,
  optimisticOperation: ?Operation,
  error: ?Error,
}

type Step = {
  label: string,
  canNext: (State<*>) => boolean,
  canPrev: (State<*>) => boolean,
  canClose: (State<*>) => boolean,
  prevStep?: number,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  updateAccountWithUpdater,
}

class SendModalBody extends PureComponent<Props, State<*>> {
  constructor({ t, initialAccount, accounts }: Props) {
    super()
    const account = initialAccount || accounts[0]
    const bridge = account ? getBridgeForCurrency(account.currency) : null
    const transaction = bridge ? bridge.createTransaction(account) : null
    this.state = {
      stepIndex: 0,
      txOperation: null,
      appStatus: null,
      deviceSelected: null,
      optimisticOperation: null,
      account,
      bridge,
      transaction,
      error: null,
    }

    this.steps = [
      {
        label: t('send:steps.amount.title'),
        canClose: () => true,
        canPrev: () => false,
        canNext: ({ bridge, account, transaction }) =>
          bridge && account && transaction
            ? bridge.isValidTransaction(account, transaction)
            : false,
      },
      {
        label: t('send:steps.connectDevice.title'),
        canClose: () => true,
        canNext: ({ deviceSelected, appStatus }) =>
          deviceSelected !== null && appStatus === 'success',
        prevStep: 0,
        canPrev: () => true,
      },
      {
        label: t('send:steps.verification.title'),
        canClose: ({ error }) => !!error,
        canNext: () => true,
        canPrev: ({ error }) => !!error,
        prevStep: 1,
      },
      {
        label: t('send:steps.confirmation.title'),
        prevStep: 0,
        canClose: () => true,
        canPrev: () => true,
        canNext: () => false,
      },
    ]
  }

  componentWillUnmount() {
    const { signTransactionSub } = this
    if (signTransactionSub) {
      signTransactionSub.unsubscribe()
    }
  }

  signTransactionSub: *

  signTransaction = async () => {
    const { deviceSelected, account, transaction, bridge } = this.state
    invariant(
      deviceSelected && account && transaction && bridge,
      'signTransaction invalid conditions',
    )
    this.signTransactionSub = bridge
      .signAndBroadcast(account, transaction, deviceSelected.path)
      .subscribe({
        next: e => {
          switch (e.type) {
            case 'signed': {
              this.onSigned()
              break
            }
            case 'broadcasted': {
              this.onOperationBroadcasted(e.operation)
              break
            }
            default:
          }
        },
        error: error => {
          this.onOperationError(error)
        },
      })
  }

  onNextStep = () =>
    this.setState(state => {
      let { stepIndex, error } = state
      if (stepIndex >= this.steps.length - 1) {
        return null
      }
      if (!this.steps[stepIndex].canNext(state)) {
        logger.warn('tried to next step without a valid state!', state, stepIndex)
        return null
      }
      stepIndex++
      if (stepIndex < 2) {
        error = null
      } else if (stepIndex === 2) {
        this.signTransaction()
      }
      return { stepIndex, error }
    })

  onChangeDevice = (deviceSelected: ?Device) => {
    this.setState({ deviceSelected })
  }

  onChangeStatus = (deviceStatus: ?string, appStatus: ?string) => {
    this.setState({ appStatus })
  }

  onPrevStep = () => {
    const { stepIndex } = this.state
    const step = this.steps[stepIndex]
    if (step && 'prevStep' in step) {
      this.setState({
        appStatus: null,
        deviceSelected: null,
        error: null,
        stepIndex: step.prevStep,
      })
    }
  }

  onSigned = () => {
    this.setState({
      stepIndex: 3,
    })
  }

  onOperationBroadcasted = (optimisticOperation: Operation) => {
    const { account, bridge } = this.state
    if (!account || !bridge) return
    const { addPendingOperation } = bridge
    if (addPendingOperation) {
      this.props.updateAccountWithUpdater(account.id, account =>
        addPendingOperation(account, optimisticOperation),
      )
    }
    this.setState({
      optimisticOperation,
      stepIndex: 3,
      error: null,
    })
  }

  onOperationError = (error: Error) => {
    // $FlowFixMe
    if (error.statusCode === 0x6985) {
      // User denied on device
      this.setState({ error })
    } else {
      this.setState({ error, stepIndex: 3 })
    }
  }

  onChangeAccount = account => {
    const bridge = getBridgeForCurrency(account.currency)
    this.setState({
      account,
      bridge,
      transaction: bridge.createTransaction(account),
    })
  }

  onChangeTransaction = transaction => {
    this.setState({ transaction })
  }

  onGoToFirstStep = () => {
    this.setState({ stepIndex: 0, error: null })
  }

  steps: Step[]

  render() {
    const { t } = this.props
    const {
      stepIndex,
      account,
      transaction,
      bridge,
      optimisticOperation,
      deviceSelected,
      error,
    } = this.state

    const step = this.steps[stepIndex]
    if (!step) return null
    const canClose = step.canClose(this.state)
    const canNext = step.canNext(this.state)
    const canPrev = step.canPrev(this.state)
    let { onClose } = this.props
    if (!canClose) {
      onClose = noop
    }

    return (
      <ModalBody onClose={onClose}>
        <PollCounterValuesOnMount />
        <SyncSkipUnderPriority priority={80} />
        {account && <SyncOneAccountOnMount priority={81} accountId={account.id} />}

        <ModalTitle>
          {canPrev && <PrevButton onClick={this.onPrevStep} />}
          {t('send:title')}
        </ModalTitle>

        <ModalContent>
          <Breadcrumb t={t} mb={6} currentStep={stepIndex} items={this.steps} />

          <ChildSwitch index={stepIndex}>
            <StepAmount
              t={t}
              account={account}
              bridge={bridge}
              transaction={transaction}
              onChangeAccount={this.onChangeAccount}
              onChangeTransaction={this.onChangeTransaction}
            />

            <StepConnectDevice
              t={t}
              account={account}
              accountName={account && account.name}
              deviceSelected={deviceSelected}
              onChangeDevice={this.onChangeDevice}
              onStatusChange={this.onChangeStatus}
            />

            <StepVerification
              t={t}
              account={account}
              bridge={bridge}
              transaction={transaction}
              device={deviceSelected}
              onOperationBroadcasted={this.onOperationBroadcasted}
              onError={this.onOperationError}
              hasError={!!error}
            />

            <StepConfirmation t={t} optimisticOperation={optimisticOperation} error={error} />
          </ChildSwitch>
        </ModalContent>

        {stepIndex === 3 ? (
          <ConfirmationFooter
            t={t}
            error={error}
            account={account}
            optimisticOperation={optimisticOperation}
            onClose={onClose}
            onGoToFirstStep={this.onGoToFirstStep}
          />
        ) : (
          account &&
          bridge &&
          transaction &&
          stepIndex < 2 && (
            <Footer
              canNext={canNext}
              onNext={this.onNextStep}
              account={account}
              bridge={bridge}
              transaction={transaction}
              showTotal={stepIndex === 0}
              t={t}
            />
          )
        )}
      </ModalBody>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(SendModalBody)
