import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColumnMappingTab from './ColumnMappingTab';
import KeyValidationTab from './KeyValidationTab';
import { Check, CheckCircle } from 'lucide-react';

export interface Column {
  id: string;
  name:string;
  type?: string;
}

export interface ColumnMapping {
  id: string;
  sourceColumn: Column;
  targetColumn: Column;
  colorIndex: number;
}

export interface KeyValidationPair {
  id: string;
  keyColumn: Column;
  validationColumn: Column;
}

interface ColumnMappingProps {
  sourceColumns?: Column[];
  targetColumns?: Column[];
  onMappingChange?: (mappings: ColumnMapping[]) => void;
  onKeyValidationChange?: (pairs: KeyValidationPair[]) => void;
}

const ColumnMapping: React.FC<ColumnMappingProps> = ({
  sourceColumns = [],
  targetColumns = [],
  onMappingChange,
  onKeyValidationChange
}) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [keyValidationPairs, setKeyValidationPairs] = useState<KeyValidationPair[]>([]);

  const handleSetMappings = useCallback((newMappings: ColumnMapping[]) => {
    const recoloredMappings = newMappings.map((m, i) => ({ ...m, colorIndex: i % 10 }));
    setMappings(recoloredMappings);
    onMappingChange?.(recoloredMappings);
  }, [onMappingChange]);

  const handleSetKeyValidationPairs = useCallback((newPairs: KeyValidationPair[]) => {
    setKeyValidationPairs(newPairs);
    onKeyValidationChange?.(newPairs);
  }, [onKeyValidationChange]);


  const allColumns = [...sourceColumns, ...targetColumns];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4">
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Column Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-1">
          Map columns, define keys, and set validation rules.
        </p>
      </div>

      <Tabs defaultValue="mapping" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="mapping" className="flex items-center gap-2">
            <span>Column Mapping</span>
            {mappings.length > 0 && (
              <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {mappings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <span>Key & Validation</span>
            {keyValidationPairs.length > 0 && (
              <span className="bg-green-600/20 text-green-700 dark:text-green-400 rounded-full h-4 w-4 flex items-center justify-center text-xs font-medium">
                <Check className="h-3 w-3" />
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          <ColumnMappingTab
            sourceColumns={sourceColumns}
            targetColumns={targetColumns}
            mappings={mappings}
            onSetMappings={handleSetMappings}
          />
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <KeyValidationTab
            allColumns={allColumns}
            pairs={keyValidationPairs}
            onSetPairs={handleSetKeyValidationPairs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColumnMapping;
export type { Column, ColumnMapping, KeyValidationPair };
