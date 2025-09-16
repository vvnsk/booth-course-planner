import React from 'react';
import { Group, Title, Image, Paper, Text, Flex, ActionIcon } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

interface NavbarProps {
  totalUnits: number;
  foundationCompleted: number;
  flmbeCompleted: number;
  onSettingsClick?: () => void;
  showSettings?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  totalUnits, 
  foundationCompleted, 
  flmbeCompleted,
  onSettingsClick,
  showSettings = false
}) => {
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
            🎓 Booth Course Planner
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
