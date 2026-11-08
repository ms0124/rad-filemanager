import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React from 'react';
import { Input, Label } from 'reactstrap';
import classnames from 'classnames';

export interface StreamQualityGroup {
  title: string;
  subTitle?: string;
  qualities: string[];
  selected: string[];
  onChange: (quality: string, checked: boolean) => void;
}

interface CheckboxProps {
  name: string;
  index: number;
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}

interface Props {
  groups: StreamQualityGroup[];
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  name,
  index,
  checked,
  onClick
}) => {
  return (
    <>
      <Input
        id={name + index}
        type='checkbox'
        onClick={onClick}
        checked={checked}
      />
      <Label
        check
        for={name + index}
        className={styles.stream__checkboxlabel}
        role='button'
      >
        {name}
      </Label>
    </>
  );
};

const StreamQualityList: React.FunctionComponent<Props> = ({ groups }) => {
  return (
    <>
      {groups.map((group, groupIndex) => (
        <React.Fragment key={group.title}>
          <div
            className={classnames(styles.stream__title, {
              [utilStyles['mt-2']]: groupIndex > 0
            })}
          >
            <span>{group.title}</span>
            {group.subTitle ? (
              <span className={styles.stream__subTitle}>
                {' '}
                {group.subTitle}{' '}
              </span>
            ) : null}
          </div>
          {group.qualities.map((quality, index) => (
            <Checkbox
              key={`${group.title}-${quality}`}
              checked={!!group.selected.find((item) => item === quality)}
              name={quality}
              index={index}
              onClick={(e) =>
                group.onChange(quality, (e.target as HTMLInputElement).checked)
              }
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default StreamQualityList;
