// @flow
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import MapsShowAllPosition from '../utils/MapsShowAllPosition';
import type { Post } from '../config/types';
import history from '../utils/history';

type ReactObjRef<ElementType: React.ElementType> = {
  current: null | React.ElementRef<ElementType>,
};

// header height is:
//   64px if the window width is same or bigger than 600px
//   56px if the window width is less than 600px
const headerHeight = window.innerWidth >= 600 ? 64 : 56;

const styles = {
  mapContainer: {
    // eliminate header height & tabs height
    height: `calc(100vh - ${headerHeight}px - 48px)`,
  },
};

type Props = {
  posts: Array<Post>,
  classes: any,
};

class PageViewPostsMap extends React.Component<Props> {
  mapRef: ReactObjRef<'div'>;

  mapsShowAllPosition: MapsShowAllPosition;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  componentDidMount = () => {
    const { posts } = this.props;
    const onPostClick = postId => history.push(`/post/${postId}`);

    if (this.mapRef.current) {
      this.mapsShowAllPosition = new MapsShowAllPosition(
        this.mapRef.current,
        onPostClick,
      );
      this.mapsShowAllPosition.placePosts(posts);
    }
  };

  componentDidUpdate = () => {
    const { posts } = this.props;
    this.mapsShowAllPosition.placePosts(posts);
  };

  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

export default withStyles(styles)(PageViewPostsMap);
