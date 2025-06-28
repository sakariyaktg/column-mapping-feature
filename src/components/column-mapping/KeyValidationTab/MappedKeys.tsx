import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowRight, Edit, Key, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KeyValidationPair } from '../index';

interface MappedKeysProps {
  pairs: KeyValidationPair[];
  onRemovePair: (pairId: string) => void;
  onEdit: () => void;
  isEditing: boolean;
  pairingMode: 'single' | 'key-validation';
}

const MappedKeyPairItem: React.FC<{
  pair: KeyValidationPair;
  onRemove: () => void;
  isSingleMode: boolean;
}> = ({ pair, onRemove, isSingleMode }) => {
  const isSelfPaired = pair.keyColumn.id === pair.validationColumn.id;

  return (
    <div className={cn('flex items-center gap-2 p-2 bg-card border border-l-4 rounded-md group transition-all duration-200 text-sm', isSelfPaired ? 'border-l-blue-400' : 'border-l-green-400', isSelfPaired ? 'hover:bg-blue-50 dark:hover:bg-blue-950/30' : 'hover:bg-green-50 dark:hover:bg-green-950/30')}>
      <div className="flex-1 flex items-center gap-2 truncate">
        <Key className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        <span className="font-medium truncate" title={pair.keyColumn.name}>{pair.keyColumn.name}</span>
        {pair.keyColumn.type && <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4">{pair.keyColumn.type}</Badge>}
      </div>
      
      {!isSingleMode && (
        <>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 flex items-center gap-2 truncate">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 shrink-0" />
                <span className="font-medium truncate" title={pair.validationColumn.name}>{pair.validationColumn.name}</span>
                {pair.validationColumn.type && <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4">{pair.validationColumn.type}</Badge>}
            </div>
        </>
      )}

      <Button variant="ghost" size="sm" onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 h-6 w-6 p-0">
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

const MappedKeys: React.FC<MappedKeysProps> = ({ pairs, onRemovePair, onEdit, isEditing, pairingMode }) => {
  if (pairs.length === 0 && !isEditing) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Plus className="h-8 w-8 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-medium">No Key/Validation Pairs Yet</p>
            <p className="text-xs">Select columns above to create pairs.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isEditing && pairingMode === 'key-validation') {
      return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 relative">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Final Key & Validation Pairs ({pairs.length})
        </h2>
        {pairingMode === 'key-validation' && pairs.length > 0 && (
            <Button onClick={onEdit} variant="outline" size="sm" className="absolute right-0 top-1/2 -translate-y-1/2">
                <Edit className="h-3 w-3 mr-1.5" /> Edit
            </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="p-3">
          <div className="space-y-1.5">
            {pairs.map((p) => (
              <MappedKeyPairItem key={p.id} pair={p}
                onRemove={() => onRemovePair(p.id)}
                isSingleMode={pairingMode === 'single'}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MappedKeys;
