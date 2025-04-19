import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';

import { API, showError, showInfo, showSuccess } from '../../helpers';
import { renderQuota } from '../../helpers/render';

const TopUp = () => {
  const { t } = useTranslation();
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpLink, setTopUpLink] = useState('');
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({});

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo(t('topup.redeem_code.empty_code'));
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess(t('topup.redeem_code.success'));
        setUserQuota((quota) => {
          return quota + data;
        });
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError(t('topup.redeem_code.request_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError(t('topup.redeem_code.no_link'));
      return;
    }
    let url = new URL(topUpLink);
    let username = user.username;
    let user_id = user.id;
    url.searchParams.append('username', username);
    url.searchParams.append('user_id', user_id);
    url.searchParams.append('transaction_id', crypto.randomUUID());
    window.open(url.toString(), '_blank');
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
      setUser(data);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
    }
    getUserQuota().then();
  }, []);

  return (
    <div className="dashboard-container">
      <Segment raised padded className="main-segment">
        <Header as="h1" dividing>
          <Icon name="credit card" />
          <Header.Content>
            {t('topup.title')}
            <Header.Subheader>
              {t('topup.get_code.current_quota')}:{' '}
              <Label color="green" size="large">
                {renderQuota(userQuota, t, 2, false)}
              </Label>
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Grid stackable columns={1} centered>
          <Grid.Column width={8}>
            <Segment
              raised
              style={{
                backgroundColor: '#f0f0f0',
                border: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '50%',
                    padding: '20px',
                    marginBottom: '15px',
                  }}
                >
                  <Icon name="ticket alternate" size="big" color="green" />
                </div>
                <Header as="h2">{t('topup.redeem_code.title')}</Header>
              </div>

              <Form size="large">
                <Form.Input
                  fluid
                  icon="key"
                  iconPosition="left"
                  placeholder={t('topup.redeem_code.placeholder')}
                  value={redemptionCode}
                  onChange={(e) => setRedemptionCode(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    setRedemptionCode(e.clipboardData.getData('text').trim());
                  }}
                />

                <Button
                  fluid
                  style={{ backgroundColor: '#e0e0e0', color: '#333', marginBottom: '1em' }}
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setRedemptionCode(text.trim());
                    } catch (err) {
                      showError(t('topup.redeem_code.paste_error'));
                    }
                  }}
                >
                  <Icon name="paste" /> {t('topup.redeem_code.paste')}
                </Button>

                <Button
                  color="green"
                  fluid
                  size="large"
                  onClick={topUp}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  icon="check"
                  labelPosition="right"
                >
                  {isSubmitting ? t('topup.redeem_code.submitting') : t('topup.redeem_code.submit')}
                  <Icon name="check" />
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

export default TopUp;
