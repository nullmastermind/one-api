import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';

import TokensTable from '../../components/TokensTable';

const Token = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <Card fluid className="chart-card">
        <Card.Content>
          <Card.Header className="header">{t('token.title')}</Card.Header>
          <TokensTable />
        </Card.Content>
      </Card>
    </div>
  );
};

export default Token;
