import React from 'react';
import { Group, Title, Image, Paper, Text, Flex } from '@mantine/core';

interface NavbarProps {
  totalUnits: number;
  foundationCompleted: number;
  flmbeCompleted: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  totalUnits, 
  foundationCompleted, 
  flmbeCompleted 
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
        </Group>
      </Flex>
    </Paper>
  );
};
