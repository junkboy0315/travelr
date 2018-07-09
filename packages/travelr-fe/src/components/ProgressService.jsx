// @flow
import { Fade, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import type { AppStore } from '../config/types';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    zIndex: 1110,
    width: '100%',
  },
};

type Props = {
  classes: any,
  app: AppStore,
};

export const ProgressService = (props: Props) => {
  const { classes } = props;
  const { inProgress } = props.app;

  return (
    <div className={classes.root}>
      <Fade
        in={inProgress}
        style={{
          transitionDelay: '0ms',
        }}
        unmountOnExit
      >
        <LinearProgress color="secondary" />
      </Fade>
    </div>
  );
};

export default withStyles(styles)(ProgressService);
