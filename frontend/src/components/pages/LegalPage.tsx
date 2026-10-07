import {
  Container,
  Paper,
  SegmentedControl,
  Text,
  Title,
} from '@mantine/core';
import type { LegalPageProps } from '@/types/legal';
import mockLegalContent from '@/shared/mocks/legalContent';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Used tab form query parameter to display the corresponding content.
 * The default tab is set to 'privacy' for the query parameter is not present or invalid.
 * SegmentedControl data is defined as an array of objects with label and value properties.
 * It is used both for tabs render and for the tab determination via checkTab function
 * setSearchParams in UseEffect fixes URL for the default tab in case of invalid requested tab.
 */
const segmentedControlData: {label: string, value: string}[] = [
  { label: 'Конфиденциальность', value: 'privacy' },
  { label: 'Соглашение', value: 'terms' },
  { label: 'Оферта', value: 'offer' },
];

const defaultTab = 'privacy';

function checkTab(tab: string): boolean {
  return segmentedControlData.some(({ value }) => value === tab);
}

const LegalPage = ({ legalContent = mockLegalContent }: LegalPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') ?? defaultTab;
  const isTabValid = checkTab(requestedTab);
  const tab = isTabValid ? requestedTab : defaultTab;

  useEffect(() => {
    if (!isTabValid) {
      setSearchParams({ tab: defaultTab }, { replace: true });
    }
  }, [isTabValid, setSearchParams]);

/**
 * fixed onChange handler to update the query parameter instead of the state.
 * Added CSS properties to the SegmentedControl component to match the design.
 */
  return (
    <Container>
      <Title order={1} mb="lg">
        Правовая информация
      </Title>
      <SegmentedControl
        data={segmentedControlData}
        value={tab}
        onChange={(v: string) => setSearchParams({ tab: v })}
        mb="lg"
        radius={99}
        color='tgblue.5'
        bg='white'
        autoContrast
        withItemsBorders={false}
      />
      <Paper p="lg">
        {(() => {
          const content = legalContent[tab];
          return (
            <>
              <Title order={3} mb="md">{content.title}</Title>
              <Text size="sm" c="dimmed">{content.text}</Text>
            </>
          );
        })()}
      </Paper>
    </Container>
  );
};

export default LegalPage;
