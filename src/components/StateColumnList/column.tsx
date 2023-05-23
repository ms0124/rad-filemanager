import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useContext, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment-jalaali';
import classnames from 'classnames';

import n from './n.png';
import folder from './folder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faKey } from '@fortawesome/free-solid-svg-icons';
import MenuTools from '../../utils/MenuTools/';
import { formatBytes } from '../../utils/index';
import { RightClick } from '../../utils';
import { downloadThumbnail } from '../../config/api';
import { TabTypes } from '../../config/types';
import { Context } from '../../store/index';
import { getBs } from '../../utils/index';
// import Empty from './empty';
interface IProps {
  list: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  tabType: number;
}

const Column: React.FunctionComponent<IProps> = ({
  list = [],
  setHash,
  tabType
}) => {
  const { setSearchText, onSelect } = useContext(Context);
  const slectedRef = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <React.Fragment>
      <RightClick query='.m-4' />
      <Row cssModule={getBs()} className={`${utilStyles['m-4']}`}>
        {list.map((item, index) => (
          <Col cssModule={getBs()} xs={3} md={3} lg={3} key={index}>
            <div
              ref={(ref) => (slectedRef.current[index] = ref)}
              onClick={() => {
                if (!onSelect) return; /// if onSelect undefined this function will dont work
                if (!item.extension && !item.isPublic) return; // for folder dont select
                if (
                  slectedRef.current[index]?.style.backgroundColor ===
                  'cornflowerblue'
                ) {
                  slectedRef.current[index]!.style!.backgroundColor =
                    'rgb(250,250,250)';
                } else {
                  slectedRef.current.map(
                    (item) =>
                      (item!.style!.backgroundColor = 'rgb(250,250,250)')
                  );
                  slectedRef.current[index]!.style!.backgroundColor =
                    'cornflowerblue';
                }
                if (onSelect) onSelect(item);
              }}
              onDoubleClick={() => {
                if (TabTypes.SearchList) {
                  setSearchText('');
                }
                item.extension ? null : setHash(item.hash);
              }}
              className={styles['col']}
              style={item.extension ? {} : { cursor: 'pointer' }}
            >
              <div className={classnames(styles['col__img-wrapper'])}>
                <div className={styles['col__menu-wrapper']}>
                  <MenuTools item={item} tabType={tabType} />
                </div>
                <div className={styles['col__icon-access-wrapper']}>
                  {item.isPublic ? (
                    <FontAwesomeIcon
                      className={styles['col__icon-access']}
                      icon={faGlobe}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className={styles['col__icon-access']}
                      icon={faKey}
                    />
                  )}
                </div>
                {item.extension ? (
                  item.thumbnail === 'THUMBNAIL_EXIST_PNG' ? (
                    <img
                      className={styles['col__img']}
                      src={`https://sandbox.podspace.ir:8443/api/files/${item.hash}/thumbnail`}
                      // src={}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  <div className={styles['col__folder-img-wrapper']}>
                    <img className={styles['col__folder-img']} src={folder} />
                  </div>
                )}
              </div>
              <h4 className={styles['col__title']}>{item?.name}</h4>
              <div className={styles['col__volume']}>
                {formatBytes(item.size)}
              </div>
              <div className={styles['col__date']}>
                {moment(item.created).format('jYYYY/jMM/jDD HH:mm:ss')}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Column;
