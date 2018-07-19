import { Button, Paper, Tab, Tabs } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconGrid from '@material-ui/icons/GridOn';
import IconMap from '@material-ui/icons/Place';
import IconSearch from '@material-ui/icons/Search';
import { History, Location } from 'history';
import * as React from 'react';
import { FilterCriterion, PostsStore } from '../config/types';
import Filter from './Filter';
import PageViewPostsGrid from './PageViewPostsGrid';
import PageViewPostsMap from './PageViewPostsMap';

const styles = {
  tabsFlexContainer: {
    justifyContent: 'center',
  },
  filterButton: {
    position: 'fixed',
    bottom: 28,
    right: 16,
  },
};

const pathTabnumberMapping = {
  '/all-grid': 0,
  '/all-map': 1,
};

type Props = {
  classes: any;
  fetchAllPosts: (criterion?: FilterCriterion) => any;
  increaseLimitCountOfGrid: () => void;
  history: History;
  location: Location;
  posts: PostsStore;
};

type State = {
  tabNumber: number;
  isFilterOpen: boolean;
};

export class PageViewPosts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      location: { pathname },
    } = this.props;

    // switch child component based on pathname
    const defaultTabNumber = pathTabnumberMapping[pathname];

    this.state = {
      isFilterOpen: false,
      tabNumber: defaultTabNumber,
    };
  }

  // @ts-ignore
  componentDidMount = () => {
    const { posts, fetchAllPosts } = this.props;
    if (!posts.all.length) {
      fetchAllPosts();
    }
  };

  // @ts-ignore
  componentDidUpdate = (prevProps: Props) => {
    const {
      location: { pathname },
    } = this.props;

    if (pathname !== prevProps.location.pathname) {
      this.setState({
        tabNumber: pathTabnumberMapping[pathname],
      });
    }
  };

  handleTabChange = (event: any, tabNumber: number) => {
    const { history } = this.props;

    this.setState({
      tabNumber,
    });

    let redirectTo;
    if (tabNumber === 0) redirectTo = '/all-grid';
    if (tabNumber === 1) redirectTo = '/all-map';

    // synchronize URL with the currently displayed component
    if (redirectTo) history.push(redirectTo);
  };

  render() {
    const {
      classes,
      posts: { all, limitCountOfGrid },
      increaseLimitCountOfGrid,
    } = this.props;

    const { tabNumber, isFilterOpen } = this.state;

    return (
      <React.Fragment>
        <Paper>
          <Tabs
            value={tabNumber}
            onChange={this.handleTabChange}
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            classes={{
              flexContainer: classes.tabsFlexContainer,
            }}
          >
            <Tab icon={<IconGrid />} />
            <Tab icon={<IconMap />} />
          </Tabs>
        </Paper>

        {/* grid view */}
        {tabNumber === 0 && (
          <div>
            <PageViewPostsGrid
              posts={all}
              limitCountOfGrid={limitCountOfGrid}
              increaseLimitCountOfGrid={increaseLimitCountOfGrid}
            />
          </div>
        )}

        {/* map view */}
        {tabNumber === 1 && <PageViewPostsMap posts={all} />}

        {/* filter */}
        <Filter
          isOpen={isFilterOpen}
          onClose={(criterion: FilterCriterion) => {
            this.setState({ isFilterOpen: false });
            // TODO: call fetchAllPosts
            // eslint-disable-next-line
            console.log(criterion);
          }}
        />

        {/* filter button */}
        <Button
          aria-label="search"
          className={classes.filterButton}
          color="primary"
          disabled={isFilterOpen}
          onClick={() => this.setState({ isFilterOpen: !isFilterOpen })}
          variant="fab"
        >
          <IconSearch />
        </Button>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(PageViewPosts);
