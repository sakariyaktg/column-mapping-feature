import React from 'react';
import ColumnMapping, { Column, ColumnMapping as Mapping, KeyValidationPair } from './components/column-mapping';
import { ThemeToggle } from './components/theme-toggle';

// Sample data for demonstration
const sampleSourceColumns: Column[] = [
  { id: 'src_1', name: 'customer_id', type: 'INTEGER' },
  { id: 'src_2', name: 'first_name', type: 'VARCHAR' },
  { id: 'src_3', name: 'last_name', type: 'VARCHAR' },
  { id: 'src_4', name: 'email_address', type: 'VARCHAR' },
  { id: 'src_5', name: 'phone_number', type: 'VARCHAR' },
  { id: 'src_6', name: 'created_date', type: 'TIMESTAMP' },
  { id: 'src_7', name: 'status', type: 'VARCHAR' },
  { id: 'src_8', name: 'country_code', type: 'VARCHAR' },
];

const sampleTargetColumns: Column[] = [
  { id: 'tgt_1', name: 'id', type: 'INTEGER' },
  { id: 'tgt_2', name: 'full_name', type: 'VARCHAR' },
  { id: 'tgt_3', name: 'email', type: 'VARCHAR' },
  { id: 'tgt_4', name: 'phone', type: 'VARCHAR' },
  { id: 'tgt_5', name: 'registration_date', type: 'TIMESTAMP' },
  { id: 'tgt_6', name: 'account_status', type: 'VARCHAR' },
  { id: 'tgt_7', name: 'region', type: 'VARCHAR' },
  { id: 'tgt_8', name: 'user_type', type: 'VARCHAR' },
];

function App() {
  const handleMappingChange = (mappings: Mapping[]) => {
    console.log('Final column mappings updated:', mappings);
  };

  const handleKeyValidationChange = (pairs: KeyValidationPair[]) => {
    console.log('Final key & validation pairs updated:', pairs);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 relative">
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <ColumnMapping
          sourceColumns={sampleSourceColumns}
          targetColumns={sampleTargetColumns}
          onMappingChange={handleMappingChange}
          onKeyValidationChange={handleKeyValidationChange}
        />
      </div>
    </div>
  );
}

export default App;
