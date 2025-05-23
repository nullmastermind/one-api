import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';

import ChannelsTable from '../../components/ChannelsTable';

const Channel = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <Card fluid className="chart-card">
        <Card.Content>
          <Card.Header className="header">{t('channel.title')}</Card.Header>
          <ChannelsTable />
        </Card.Content>
      </Card>
    </div>
  );
};

export default Channel;
