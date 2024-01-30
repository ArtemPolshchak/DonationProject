package donation.main.service;

import donation.main.enumeration.TransactionState;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

import static java.util.Map.entry;

@Component
public class TransactionStateManager {

    private final Map<TransactionState, Set<TransactionState>> allowedTransactions;

    public TransactionStateManager() {
        allowedTransactions = Map.ofEntries(
                entry(TransactionState.IN_PROGRESS, EnumSet.of(TransactionState.CANCELLED, TransactionState.COMPLETED))
        );
    }

    public boolean isAllowedTransitionState(TransactionState currentState, TransactionState newState) {
        return isValidState(currentState) && allowedTransactions.get(currentState).contains(newState);
    }

    private boolean isValidState(TransactionState state) {
        return state != TransactionState.CANCELLED && state != TransactionState.COMPLETED;
    }
}

