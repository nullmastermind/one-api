import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

const Loading = ({ prompt: name = 'page' }) => {
  return (
    <Segment style={{ height: 100 }}>
      <Dimmer active inverted>
        <Loader indeterminate>Loading {name}...</Loader>
      </Dimmer>
    </Segment>
  );
};

export default Loading;
