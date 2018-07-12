// @flow
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import MapsPickPosition from '../utils/MapsPickPosition';
import type { UserStore, NewPost, LatLng } from '../config/types';

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 4}px`,
    flexDirection: 'column',
    maxWidth: 500,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    '& legend': {
      marginBottom: theme.spacing.unit * 1,
    },
  },
});

type ReactObjRef<ElementType: React.ElementType> = {
  current: null | React.ElementRef<ElementType>,
};

type Props = {
  classes: any,
  user: UserStore,
  createPost: (user: UserStore, newPost: NewPost) => void,
  addSnackbarQueue: (message: string) => any,
};

type State = {
  oldImageFilePath: string,
  newImageFilePath: string,
  description: string,
  shootDate: string,
  lng: ?number,
  lat: ?number,
};

export class PageCreatePost extends React.Component<Props, State> {
  state = {
    oldImageFilePath: '',
    newImageFilePath: '',
    description: '',
    shootDate: '',
    lng: null,
    lat: null,
  };

  oldImage: ReactObjRef<'input'>;

  newImage: ReactObjRef<'input'>;

  mapRef: ReactObjRef<'div'>;

  mapsPickPosition: MapsPickPosition;

  constructor(props: Props) {
    super(props);

    this.oldImage = React.createRef();
    this.newImage = React.createRef();
    this.mapRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.mapRef.current) {
      this.mapsPickPosition = new MapsPickPosition(
        this.mapRef.current,
        this.handlePinPositionChange,
      );
    }
  };

  getCurrentPosition = () => {
    const { addSnackbarQueue } = this.props;

    if ('geolocation' in navigator) {
      const onSuccess = geom => {
        this.mapsPickPosition.setPosition({
          lng: geom.coords.longitude,
          lat: geom.coords.latitude,
        });
        this.setState({
          lng: geom.coords.longitude,
          lat: geom.coords.latitude,
        });
      };
      const onError = () => {
        addSnackbarQueue(
          '位置情報を取得できませんでした。GPSの許可設定を確認してください。',
        );
      };
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      addSnackbarQueue('gpsが利用できない環境です。');
    }
  };

  handleChange(e: SyntheticInputEvent<>, stateKayName: string) {
    e.preventDefault();
    this.setState({ [stateKayName]: e.target.value });
  }

  handlePinPositionChange = (position: LatLng) => {
    this.setState({
      lng: position.lng,
      lat: position.lat,
    });
  };

  handleSubmit = async () => {
    const { user, addSnackbarQueue, createPost } = this.props;
    const {
      oldImageFilePath,
      newImageFilePath,
      description,
      shootDate,
      lng,
      lat,
    } = this.state;

    if (
      !oldImageFilePath ||
      !newImageFilePath ||
      // missing description is OK
      !shootDate ||
      !lng ||
      !lat
    ) {
      return addSnackbarQueue('入力項目が不足しています。');
    }

    if (!this.oldImage.current || !this.newImage.current) {
      return addSnackbarQueue('画像ファイルを取得できませんでした');
    }

    const oldImageFile = this.oldImage.current.files[0];
    const newImageFile = this.newImage.current.files[0];

    const newPost: NewPost = {
      oldImageFile,
      newImageFile,
      description,
      shootDate,
      lng,
      lat,
    };

    return createPost(user, newPost);
  };

  render() {
    const { classes } = this.props;
    const {
      oldImageFilePath,
      newImageFilePath,
      description,
      shootDate,
    } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="title">写真を投稿する</Typography>
        <FormControl required>
          <FormLabel component="legend">昔の写真</FormLabel>
          {oldImageFilePath && <Typography>{oldImageFilePath}</Typography>}
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              ref={this.oldImage}
              capture="camera"
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              value={oldImageFilePath}
              onChange={e => this.handleChange(e, 'oldImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">今の写真</FormLabel>
          {newImageFilePath && <Typography>{newImageFilePath}</Typography>}
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              ref={this.newImage}
              capture="camera"
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              value={newImageFilePath}
              onChange={e => this.handleChange(e, 'newImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">説明文</FormLabel>
          <Input
            placeholder="説明文"
            multiline
            value={description}
            onChange={e => this.handleChange(e, 'description')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">昔の写真の撮影日</FormLabel>
          <TextField
            type="date"
            value={shootDate}
            onChange={e => this.handleChange(e, 'shootDate')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">撮影場所</FormLabel>
          <div
            ref={this.mapRef}
            style={{
              width: '100%',
              height: '200px',
              background: 'gray',
              marginBottom: '1rem',
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={this.getCurrentPosition}
          >
            現在地から位置を取得
          </Button>
        </FormControl>
        <FormControl component="fieldset" required>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleSubmit}
          >
            投稿する
          </Button>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(PageCreatePost);
