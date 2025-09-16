import React, { useRef } from 'react';
import { Group, Title, Image, Paper, Text, Flex, ActionIcon, Button } from '@mantine/core';
import { IconSettings, IconDownload, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface NavbarProps {
  totalUnits: number;
  foundationCompleted: number;
  flmbeCompleted: number;
  onSettingsClick?: () => void;
  showSettings?: boolean;
  onExportSchedule?: () => void;
  onImportSchedule?: (file: File) => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  totalUnits, 
  foundationCompleted, 
  flmbeCompleted,
  onSettingsClick,
  showSettings = false,
  onExportSchedule,
  onImportSchedule
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (onExportSchedule) {
      onExportSchedule();
      notifications.show({
        title: 'Schedule Exported',
        message: 'Your course schedule has been downloaded successfully.',
        color: 'green'
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportSchedule) {
      try {
        await onImportSchedule(file);
        notifications.show({
          title: 'Schedule Imported',
          message: 'Your course schedule has been loaded successfully.',
          color: 'green'
        });
      } catch (error) {
        notifications.show({
          title: 'Import Failed',
          message: error instanceof Error ? error.message : 'Failed to import schedule file.',
          color: 'red'
        });
      }
    }
    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };
  return (
    <Paper 
      p="md" 
      withBorder 
      style={{
        backgroundColor: '#800020',
        borderBottom: '1px solid #600015',
        color: 'white'
      }}
    >
      <Flex justify="space-between" align="center">
        <Group gap="sm" align="center">
          <div style={{ width: '150px', height: '45px', flexShrink: 0 }}>
            <Image
              src="/logo.png"
              alt="Booth Logo"
              width={150}
              height={45}
              fit="contain"
              style={{ width: '150px', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <Title order={1} size="h2" c="white" style={{ marginLeft: '8px', flexShrink: 0 }}>
            Course Planner
          </Title>
        </Group>
        
        <Group gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="rgba(255, 255, 255, 0.7)">Total Units</Text>
            <Text size="sm" fw={500} c="white">{totalUnits}/2000</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="rgba(255, 255, 255, 0.7)">Foundation</Text>
            <Text size="sm" fw={500} c="white">{foundationCompleted}/3</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="rgba(255, 255, 255, 0.7)">FLMBE</Text>
            <Text size="sm" fw={500} c="white">{flmbeCompleted}/7</Text>
          </div>
          
          {/* Import/Export buttons */}
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              Export
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconUpload size={16} />}
              onClick={handleImportClick}
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </Group>
          
          <ActionIcon
            variant={showSettings ? 'filled' : 'subtle'}
            color={showSettings ? 'blue' : 'gray'}
            size="lg"
            onClick={onSettingsClick}
            style={{ 
              color: showSettings ? 'white' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: showSettings ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
            }}
            title="Toggle Settings"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>
      </Flex>
    </Paper>
  );
};
