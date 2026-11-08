import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, Spinner } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import { getBs } from '../../utils/index';
import { useStreamPrepare } from '../../config/hooks';
import { audioQualities, videoQualities } from './upload.constants';
import StreamQualityList from './StreamQualityList';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
  item: {
    hash: string;
    name?: string;
    extension?: string;
  };
}

const StreamModal: React.FunctionComponent<IProps> = ({
  isOpen,
  toggle,
  item
}) => {
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const streamPrepare = useStreamPrepare({});

  const extension = (item?.extension || '').toLowerCase();
  const isAudio = extension === 'mp3';

  const qualities = useMemo(
    () => (isAudio ? audioQualities : videoQualities),
    [isAudio]
  );

  useEffect(() => {
    if (isOpen) setSelectedQualities([]);
  }, [isOpen, item?.hash]);

  const handleToggleQuality = (quality: string, checked: boolean) => {
    setSelectedQualities((prev) =>
      checked ? [...prev, quality] : prev.filter((item) => item !== quality)
    );
  };

  const handleSubmit = async () => {
    if (selectedQualities.length === 0) return;
    try {
      const result: any = await streamPrepare.mutateAsync({
        hash: item?.hash,
        qualities: selectedQualities
      });
      if (!result?.hasError) toggle();
    } catch (error) {
      // error messages are shown by httpRequest
      console.error(error);
    }
  };

  return (
    <Modal
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      contentClassName={styles.upload}
      className={styles['modal-container']}
      zIndex={99991}
    >
      <ModalBody cssModule={getBs()}>
        <div className={styles['stream-modal__header']}>
          <FontAwesomeIcon
            icon={faTimes}
            role='button'
            className={styles['stream-modal__close']}
            onClick={toggle}
          />
        </div>
        <div className={classnames(styles.guide, utilStyles['mb-3'])}>
          <FontAwesomeIcon
            className={styles.guide__icon}
            icon={faExclamationTriangle}
          />
          <span className={styles.guide__title}>
            حداقل یکی از کیفیت های استریم را انتخاب کنید.
          </span>
        </div>
        <div className={styles.stream}>
          <StreamQualityList
            groups={[
              {
                title: isAudio ? 'کیفیت فایل صوتی' : 'کیفیت فایل تصویری',
                subTitle: `(${extension})`,
                qualities,
                selected: selectedQualities,
                onChange: handleToggleQuality
              }
            ]}
          />
        </div>
        <div className={styles['stream-modal__footer']}>
          <Button
            cssModule={getBs()}
            color='primary'
            onClick={handleSubmit}
            disabled={selectedQualities.length === 0 || streamPrepare.isLoading}
            className={`${utilStyles['round-8']} ${styles['stream-modal__save']}`}
          >
            {streamPrepare.isLoading ? (
              <Spinner cssModule={getBs()} size='sm' />
            ) : (
              'ذخیره'
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default StreamModal;
