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
import SingleColumnMapping from './SingleColumnMapping';
import MultiColumnMapping from './MultiColumnMapping';
import MappedColumns from './MappedColumns';
import { Column, ColumnMapping } from '../index';
import { AlertTriangle, Repeat, Shuffle } from 'lucide-react';

interface ColumnMappingTabProps {
  sourceColumns: Column[];
  targetColumns: Column[];
  mappings: ColumnMapping[];
  onSetMappings: (mappings: ColumnMapping[]) => void;
}

type MappingMode = 'single' | 'multi';

const ColumnMappingTab: React.FC<ColumnMappingTabProps> = (props) => {
  const [mappingMode, setMappingMode] = useState<MappingMode>('multi');
  const [isEditing, setIsEditing] = useState(false);
  
  // Staging state for multi-mapping
  const [stagedSourceIds, setStagedSourceIds] = useState<string[]>([]);
  const [stagedTargetIds, setStagedTargetIds] = useState<string[]>([]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState<MappingMode>(mappingMode);

  useEffect(() => {
    // When not editing, clear the staging area
    if (!isEditing) {
      setStagedSourceIds([]);
      setStagedTargetIds([]);
    }
  }, [isEditing]);

  const handleModeChange = (isMulti: boolean) => {
    const newMode: MappingMode = isMulti ? 'multi' : 'single';
    if (props.mappings.length > 0 && newMode !== mappingMode) {
      setPendingMode(newMode);
      setShowConfirmDialog(true);
    } else {
      setMappingMode(newMode);
      setIsEditing(false); // Reset edit state on mode change
    }
  };

  const confirmModeChange = () => {
    setMappingMode(pendingMode);
    props.onSetMappings([]);
    setIsEditing(false);
    setShowConfirmDialog(false);
  };
  
  const handleSetSingleMappings = (selectedColumns: Column[]) => {
    const newMappings = selectedColumns.map((col, i) => ({
      id: `map-single-${col.id}`,
      sourceColumn: col,
      targetColumn: col,
      colorIndex: i % 10
    }));
    props.onSetMappings(newMappings);
  };

  const handleApplyMultiMappings = (sourceOrder: string[], targetOrder: string[]) => {
    const newMappings = sourceOrder.map((sourceId, index) => {
        const targetId = targetOrder[index];
        const sourceColumn = props.sourceColumns.find(c => c.id === sourceId)!;
        const targetColumn = props.targetColumns.find(c => c.id === targetId)!;
        return {
            id: `map-${sourceId}-${targetId}-${Date.now()}-${index}`,
            sourceColumn,
            targetColumn,
            colorIndex: index % 10,
        };
    });
    props.onSetMappings(newMappings);
    setIsEditing(false); // Exit edit mode after applying changes
  };

  const handleRemoveMapping = (mappingId: string) => {
    const newMappings = props.mappings.filter(m => m.id !== mappingId);
    props.onSetMappings(newMappings);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setStagedSourceIds(props.mappings.map(m => m.sourceColumn.id));
    setStagedTargetIds(props.mappings.map(m => m.targetColumn.id));
  };

  const availableSourceCols = props.sourceColumns;
  const availableTargetCols = props.targetColumns;

  const showMappingEditor = mappingMode === 'multi' && (isEditing || props.mappings.length === 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
        <Label className="text-sm font-semibold">Mapping Mode</Label>
        <div className="flex items-center space-x-2">
            <Label htmlFor="mapping-mode" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Repeat className="h-3.5 w-3.5" /> Single Column
            </Label>
            <Switch id="mapping-mode" checked={mappingMode === 'multi'} onCheckedChange={handleModeChange} />
            <Label htmlFor="mapping-mode" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shuffle className="h-3.5 w-3.5" /> Source-to-Target
            </Label>
        </div>
      </div>
      
      {mappingMode === 'single' ? (
        <SingleColumnMapping 
          allColumns={[...props.sourceColumns, ...props.targetColumns]}
          selectedIds={props.mappings.map(m => m.sourceColumn.id)}
          onSelectionChange={handleSetSingleMappings}
        />
      ) : (
        showMappingEditor && (
          <MultiColumnMapping
            sourceColumns={availableSourceCols}
            targetColumns={availableTargetCols}
            initialSourceIds={stagedSourceIds}
            initialTargetIds={stagedTargetIds}
            onMap={handleApplyMultiMappings}
            isEditing={isEditing}
          />
        )
      )}

      <div className="flex items-center pt-2">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
      </div>

      <MappedColumns
        mappings={props.mappings}
        onRemoveMapping={handleRemoveMapping}
        onEdit={handleEdit}
        isEditing={isEditing}
        mappingMode={mappingMode}
      />
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-amber-500"/>Switch Mapping Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the mapping mode will clear all your current mappings. Are you sure you want to continue?
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

export default ColumnMappingTab;
