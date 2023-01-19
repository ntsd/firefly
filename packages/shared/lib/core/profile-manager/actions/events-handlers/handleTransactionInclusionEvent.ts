import { syncVotingPower } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityAction, ActivityDirection, ActivityType } from '@core/wallet'
import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import {
    getActivityByTransactionId,
    updateActivityByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'

import { WalletApiEvent } from '../../enums'
import { ITransactionInclusionEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionInclusion)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEventPayload)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
): void {
    updateActivityByTransactionId(accountIndex, payload.transactionId, {
        inclusionState: payload.inclusionState,
    })

    const activity = getActivityByTransactionId(accountIndex, payload.transactionId)

    if (activity?.type === ActivityType.Nft) {
        const isSpendable =
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.action !== ActivityAction.Burn
        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable })
    }

    if (activity?.type === ActivityType.Governance) {
        syncVotingPower(accountIndex)
    }

    updateClaimingTransactionInclusion(payload.transactionId, payload.inclusionState, accountIndex)
}
