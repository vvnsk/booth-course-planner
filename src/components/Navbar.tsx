import React, { useRef } from 'react';
import { Group, Title, Image, Paper, Text, Flex, ActionIcon, Button, Stack, Box } from '@mantine/core';
import { IconSettings, IconDownload, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

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
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  return (
    <Paper 
      p={isMobile ? "sm" : "md"} 
      withBorder 
      style={{
        backgroundColor: '#800020',
        borderBottom: '1px solid #600015',
        color: 'white'
      }}
    >
      {isMobile ? (
        <Stack gap="sm">
          {/* Mobile: First row - Logo and buttons */}
          <Flex justify="space-between" align="center">
            <Group gap="sm" align="center">
              <Box style={{ width: '120px', height: '36px', flexShrink: 0 }}>
                <Image
                  src="/logo.png"
                  alt="Booth Logo"
                  width={120}
                  height={36}
                  fit="contain"
                  style={{ width: '120px', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Title order={1} size="h3" c="white" style={{ flexShrink: 0 }}>
                Course Planner
              </Title>
            </Group>
            
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={handleExport}
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                title="Export"
              >
                <IconDownload size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={handleImportClick}
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                title="Import"
              >
                <IconUpload size={16} />
              </ActionIcon>
              <ActionIcon
                variant={showSettings ? 'filled' : 'subtle'}
                color={showSettings ? 'blue' : 'gray'}
                size="sm"
                onClick={onSettingsClick}
                style={{ 
                  color: showSettings ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: showSettings ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}
                title="Toggle Settings"
              >
                <IconSettings size={16} />
              </ActionIcon>
            </Group>
          </Flex>
          
          {/* Mobile: Second row - Stats */}
          <Group gap="lg" justify="center">
            <div style={{ textAlign: 'center' }}>
              <Text size="xs" c="rgba(255, 255, 255, 0.7)">Units</Text>
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
          </Group>
          
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Stack>
      ) : (
        <Flex justify="space-between" align="center">
          <Group gap="sm" align="center">
            <Box style={{ width: isTablet ? '120px' : '150px', height: isTablet ? '36px' : '45px', flexShrink: 0 }}>
              <Image
                src="/logo.png"
                alt="Booth Logo"
                width={isTablet ? 120 : 150}
                height={isTablet ? 36 : 45}
                fit="contain"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Title order={1} size={isTablet ? "h3" : "h2"} c="white" style={{ marginLeft: '8px', flexShrink: 0 }}>
              Course Planner
            </Title>
          </Group>
          
          <Group gap={isTablet ? "md" : "lg"}>
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
                size={isTablet ? "xs" : "xs"}
                leftSection={<IconDownload size={14} />}
                onClick={handleExport}
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {isTablet ? "" : "Export"}
              </Button>
              <Button
                variant="subtle"
                size={isTablet ? "xs" : "xs"}
                leftSection={<IconUpload size={14} />}
                onClick={handleImportClick}
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                {isTablet ? "" : "Import"}
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
      )}
    </Paper>
  );
};
