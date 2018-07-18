import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import Hr from './Hr';

const googleTheme = createMuiTheme({
  palette: {
    primary: { main: '#DB4437' }, // Purple and green play nicely together.
  },
});

const facebookTheme = createMuiTheme({
  palette: {
    primary: { main: '#3B5998' }, // Purple and green play nicely together.
  },
});

const styles = theme => ({
  container: {
    width: '280px',
    margin: 'auto',
  },
  spacer: {
    marginTop: theme.spacing.unit * 4,
  },
});

type Props = {
  classes: any;
  signInWithGoogle: () => any;
  signInWithFacebook: () => any;
  signInWithEmail: (email: string, password: string) => any;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => any;
  sendPasswordResetEmail: (email: string) => void;
};

type State = {
  mailAuthMode: 'signin' | 'signup' | 'resetPassword';
  displayName: string;
  email: string;
  password: string;
};

export class PageAuth extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      mailAuthMode: 'signup',
      displayName: '',
      email: '',
      password: '',
    };
  }

  signInWithGoogle = () => {
    const { signInWithGoogle } = this.props;
    signInWithGoogle();
  };

  signInWithFacebook = async () => {
    const { signInWithFacebook } = this.props;
    signInWithFacebook();
  };

  signInWithEmail = async () => {
    const { signInWithEmail } = this.props;
    const { email, password } = this.state;
    signInWithEmail(email, password);
  };

  signUpWithEmail = async () => {
    const { signUpWithEmail } = this.props;
    const { email, password, displayName } = this.state;
    signUpWithEmail(email, password, displayName);
  };

  resetPassword = () => {
    const { sendPasswordResetEmail } = this.props;
    const { email } = this.state;
    sendPasswordResetEmail(email);
  };

  handleChange(e: any, stateKayName: string) {
    e.preventDefault();
    // @ts-ignore
    this.setState({ [stateKayName]: e.target.value });
  }

  renderSignUp = () => {
    const { classes } = this.props;
    const { displayName, email, password } = this.state;

    return (
      <React.Fragment>
        <TextField
          label="ニックネーム"
          margin="normal"
          value={displayName}
          onChange={e => this.handleChange(e, 'displayName')}
        />

        <TextField
          label="メールアドレス"
          margin="normal"
          value={email}
          onChange={e => this.handleChange(e, 'email')}
        />
        <TextField
          label="パスワード"
          type="password"
          margin="normal"
          value={password}
          onChange={e => this.handleChange(e, 'password')}
        />

        <div className={classes.spacer} />

        <Button
          size="large"
          variant="contained"
          color="default"
          onClick={this.signUpWithEmail}
        >
          <Typography color="inherit">メールアドレスでサインアップ</Typography>
        </Button>

        <div className={classes.spacer} />

        <Typography
          color="secondary"
          onClick={() => this.setState({ mailAuthMode: 'signin' })}
          align="center"
          style={{ cursor: 'pointer' }}
        >
          メールでサインインはこちら
        </Typography>

        <div className={classes.spacer} />

        <Typography
          color="secondary"
          onClick={() => this.setState({ mailAuthMode: 'resetPassword' })}
          align="center"
          style={{ cursor: 'pointer' }}
        >
          パスワードを忘れた方はこちら
        </Typography>
      </React.Fragment>
    );
  };

  renderSignIn = () => {
    const { classes } = this.props;
    const { email, password } = this.state;

    return (
      <React.Fragment>
        <TextField
          label="メールアドレス"
          margin="normal"
          value={email}
          onChange={e => this.handleChange(e, 'email')}
        />
        <TextField
          label="パスワード"
          type="password"
          margin="normal"
          value={password}
          onChange={e => this.handleChange(e, 'password')}
        />

        <div className={classes.spacer} />

        <Button
          size="large"
          variant="contained"
          color="default"
          onClick={this.signInWithEmail}
        >
          <Typography color="inherit">メールアドレスでサインイン</Typography>
        </Button>
      </React.Fragment>
    );
  };

  renderResetPassword = () => {
    const { classes } = this.props;
    const { email } = this.state;

    return (
      <React.Fragment>
        <TextField
          label="メールアドレス"
          margin="normal"
          value={email}
          onChange={e => this.handleChange(e, 'email')}
        />

        <div className={classes.spacer} />

        <Button
          size="large"
          variant="contained"
          color="default"
          onClick={this.resetPassword}
        >
          <Typography color="inherit">パスワードをリセット</Typography>
        </Button>
      </React.Fragment>
    );
  };

  // @ts-ignore
  render = () => {
    const { classes } = this.props;
    const { mailAuthMode } = this.state;

    return (
      <div>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          className={classes.container}
        >
          <div className={classes.spacer} />
          <Typography align="center">
            サインインして写真を投稿しよう！
          </Typography>
          <div className={classes.spacer} />

          <MuiThemeProvider theme={googleTheme}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={this.signInWithGoogle}
            >
              <Typography color="inherit">Googleでサインイン</Typography>
            </Button>
          </MuiThemeProvider>

          <div className={classes.spacer} />

          <MuiThemeProvider theme={facebookTheme}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={this.signInWithFacebook}
            >
              <Typography color="inherit">Facebookでサインイン</Typography>
            </Button>
          </MuiThemeProvider>

          <div className={classes.spacer} />
          <Hr text="or" />

          {mailAuthMode === 'signup' && this.renderSignUp()}
          {mailAuthMode === 'signin' && this.renderSignIn()}
          {mailAuthMode === 'resetPassword' && this.renderResetPassword()}
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(PageAuth);
