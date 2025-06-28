import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SingleKeySelection from './SingleKeySelection';
import KeyValidationPairing from './KeyValidationPairing';
import MappedKeys from './MappedKeys';
import { Column, KeyValidationPair } from '../index';
import { AlertTriangle, Key, ShieldCheck } from 'lucide-react';

interface KeyValidationTabProps {
  allColumns: Column[];
  pairs: KeyValidationPair[];
  onSetPairs: (pairs: KeyValidationPair[]) => void;
}

type PairingMode = 'single' | 'key-validation';

const KeyValidationTab: React.FC<KeyValidationTabProps> = (props) => {
  const [pairingMode, setPairingMode] = useState<PairingMode>('key-validation');
  const [isEditing, setIsEditing] = useState(false);
  
  const [stagedKeyIds, setStagedKeyIds] = useState<string[]>([]);
  const [stagedValidationIds, setStagedValidationIds] = useState<string[]>([]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState<PairingMode>(pairingMode);

  useEffect(() => {
    if (!isEditing) {
      setStagedKeyIds([]);
      setStagedValidationIds([]);
    }
  }, [isEditing]);

  const handleModeChange = (isKeyValidation: boolean) => {
    const newMode: PairingMode = isKeyValidation ? 'key-validation' : 'single';
    if (props.pairs.length > 0 && newMode !== pairingMode) {
      setPendingMode(newMode);
      setShowConfirmDialog(true);
    } else {
      setPairingMode(newMode);
      setIsEditing(false);
    }
  };

  const confirmModeChange = () => {
    setPairingMode(pendingMode);
    props.onSetPairs([]);
    setIsEditing(false);
    setShowConfirmDialog(false);
  };
  
  const handleSetSingleKeys = (selectedColumns: Column[]) => {
    const newPairs = selectedColumns.map((col) => ({
      id: `key-single-${col.id}`,
      keyColumn: col,
      validationColumn: col,
    }));
    props.onSetPairs(newPairs);
  };

  const handleApplyPairs = (keyOrder: string[], validationOrder: string[]) => {
    const newPairs = keyOrder.map((keyId, index) => {
        const validationId = validationOrder[index];
        const keyColumn = props.allColumns.find(c => c.id === keyId)!;
        const validationColumn = props.allColumns.find(c => c.id === validationId)!;
        return {
            id: `pair-${keyId}-${validationId}-${Date.now()}-${index}`,
            keyColumn,
            validationColumn,
        };
    });
    props.onSetPairs(newPairs);
    setIsEditing(false);
  };

  const handleRemovePair = (pairId: string) => {
    const newPairs = props.pairs.filter(p => p.id !== pairId);
    props.onSetPairs(newPairs);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setStagedKeyIds(props.pairs.map(p => p.keyColumn.id));
    setStagedValidationIds(props.pairs.map(p => p.validationColumn.id));
  };

  const showPairingEditor = pairingMode === 'key-validation' && (isEditing || props.pairs.length === 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
        <Label className="text-sm font-semibold">Pairing Mode</Label>
        <div className="flex items-center space-x-2">
            <Label htmlFor="pairing-mode" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Key className="h-3.5 w-3.5" /> Single Key
            </Label>
            <Switch id="pairing-mode" checked={pairingMode === 'key-validation'} onCheckedChange={handleModeChange} />
            <Label htmlFor="pairing-mode" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Key-to-Validation
            </Label>
        </div>
      </div>
      
      {pairingMode === 'single' ? (
        <SingleKeySelection 
          allColumns={props.allColumns}
          selectedIds={props.pairs.map(p => p.keyColumn.id)}
          onSelectionChange={handleSetSingleKeys}
        />
      ) : (
        showPairingEditor && (
          <KeyValidationPairing
            allColumns={props.allColumns}
            initialKeyIds={stagedKeyIds}
            initialValidationIds={stagedValidationIds}
            onPair={handleApplyPairs}
            isEditing={isEditing}
          />
        )
      )}

      <div className="flex items-center pt-2">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <MappedKeys
        pairs={props.pairs}
        onRemovePair={handleRemovePair}
        onEdit={handleEdit}
        isEditing={isEditing}
        pairingMode={pairingMode}
      />
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-amber-500"/>Switch Pairing Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the mode will clear all your current key/validation pairs. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmModeChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KeyValidationTab;
