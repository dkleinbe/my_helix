import { modals } from "@mantine/modals"
import { Text } from '@mantine/core';

export function confirmLeaveModal(onCancel : () => void, onConfirm : () => void) {
    modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
          <Text size="sm">
            Il y a des modifications non sauvegardées. Si vous continuez, les données seront perdues
          </Text>
        ),
        labels: { confirm: 'Continuer', cancel: 'Annuler' },
        onCancel: onCancel,
        onConfirm: onConfirm,
      })
  }
