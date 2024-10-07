import * as React from 'react';
import {
  ActionList,
  ActionListItem,
  Button,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import text from '@patternfly/react-styles/css/utilities/Text/text';
import { CheckIcon, PencilAltIcon, TimesIcon } from '@patternfly/react-icons';

import './DashboardDescriptionListGroup.scss';

type EditableProps = {
  isEditing: boolean;
  contentWhenEditing: React.ReactNode;
  isSavingEdits?: boolean;
  onEditClick: () => void;
  onSaveEditsClick: () => void;
  onDiscardEditsClick: () => void;
  editButtonTestId?: string;
  saveButtonTestId?: string;
  cancelButtonTestId?: string;
};

export type DashboardDescriptionListGroupProps = {
  title: React.ReactNode;
  tooltip?: React.ReactNode;
  action?: React.ReactNode;
  isEmpty?: boolean;
  contentWhenEmpty?: React.ReactNode;
  children: React.ReactNode;
  groupTestId?: string;
} & (({ isEditable: true } & EditableProps) | ({ isEditable?: false } & Partial<EditableProps>));

const DashboardDescriptionListGroup: React.FC<DashboardDescriptionListGroupProps> = (props) => {
  const {
    title,
    tooltip,
    action,
    isEmpty,
    contentWhenEmpty,
    isEditable = false,
    isEditing,
    contentWhenEditing,
    isSavingEdits = false,
    onEditClick,
    onSaveEditsClick,
    onDiscardEditsClick,
    children,
    groupTestId,
    editButtonTestId,
    saveButtonTestId,
    cancelButtonTestId,
  } = props;
  return (
    <DescriptionListGroup data-testid={groupTestId}>
      {action || isEditable ? (
        <DescriptionListTerm className="odh-custom-description-list-term-with-action">
          <Split>
            <SplitItem isFilled>{title}</SplitItem>
            <SplitItem>
              {action ||
                (isEditing ? (
                  <ActionList isIconList>
                    <ActionListItem>
                      <Button
                        data-testid={saveButtonTestId}
                        icon={<CheckIcon />}
                        aria-label={`Save edits to ${title}`}
                        variant="link"
                        onClick={onSaveEditsClick}
                        isDisabled={isSavingEdits}
                      />
                    </ActionListItem>
                    <ActionListItem>
                      <Button
                        data-testid={cancelButtonTestId}
                        icon={<TimesIcon />}
                        aria-label={`Discard edits to ${title} `}
                        variant="plain"
                        onClick={onDiscardEditsClick}
                        isDisabled={isSavingEdits}
                      />
                    </ActionListItem>
                  </ActionList>
                ) : (
                  <Button
                    data-testid={editButtonTestId}
                    aria-label={`Edit ${title}`}
                    isInline
                    variant="link"
                    icon={<PencilAltIcon />}
                    iconPosition="end"
                    onClick={onEditClick}
                  >
                    Edit
                  </Button>
                ))}
            </SplitItem>
          </Split>
        </DescriptionListTerm>
      ) : (
        <DescriptionListTerm>
          <Flex
            spaceItems={{ default: 'spaceItemsSm' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            <FlexItem>{title}</FlexItem>
            {tooltip}
          </Flex>
        </DescriptionListTerm>
      )}
      <DescriptionListDescription
        className={isEmpty && !isEditing ? text.textColorDisabled : ''}
        aria-disabled={!!(isEmpty && !isEditing)}
      >
        {isEditing ? contentWhenEditing : isEmpty ? contentWhenEmpty : children}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default DashboardDescriptionListGroup;
