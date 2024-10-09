import * as React from 'react';
import {
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  Popover,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { Modal } from '@patternfly/react-core/deprecated';
import {
  ExclamationCircleIcon,
  OutlinedQuestionCircleIcon,
  WarningTriangleIcon,
} from '@patternfly/react-icons';
import DashboardModalFooter from '~/concepts/dashboard/DashboardModalFooter';
import {
  ConnectionTypeDataField,
  connectionTypeDataFields,
  ConnectionTypeField,
  ConnectionTypeFieldType,
  isConnectionTypeDataField,
} from '~/concepts/connectionTypes/types';
import {
  fieldNameToEnvVar,
  fieldTypeToString,
  isValidEnvVar,
} from '~/concepts/connectionTypes/utils';
import { isEnumMember } from '~/utilities/utils';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import DataFieldPropertiesForm from '~/pages/connectionTypes/manage/DataFieldPropertiesForm';
import { prepareFieldForSave } from '~/pages/connectionTypes/manage/manageFieldUtils';

const isConnectionTypeFieldType = (
  fieldType: string | number | undefined,
): fieldType is ConnectionTypeFieldType =>
  isEnumMember(fieldType?.toString(), ConnectionTypeFieldType);

type Props = {
  field?: ConnectionTypeDataField;
  onClose: () => void;
  onSubmit: (field: ConnectionTypeDataField) => void;
  isEdit?: boolean;
  fields?: ConnectionTypeField[];
};

export const ConnectionTypeDataFieldModal: React.FC<Props> = ({
  field,
  onClose,
  onSubmit,
  isEdit,
  fields,
}) => {
  const [name, setName] = React.useState<string>(field?.name || '');
  const [description, setDescription] = React.useState<string | undefined>(field?.description);
  const [envVar, setEnvVar] = React.useState<string>(field?.envVar || '');
  const [fieldType, setFieldType] = React.useState<ConnectionTypeFieldType | undefined>(
    field?.type
      ? // Cast from specific type to generic type
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any
        (field.type as ConnectionTypeFieldType)
      : ConnectionTypeFieldType.ShortText,
  );
  const [required, setRequired] = React.useState<boolean | undefined>(field?.required);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = React.useState<boolean>(false);
  const [properties, setProperties] = React.useState<unknown>(field?.properties || {});
  const [isPropertiesValid, setPropertiesValid] = React.useState(true);
  const [autoGenerateEnvVar, setAutoGenerateEnvVar] = React.useState<boolean>(!envVar);

  const isEnvVarConflict = React.useMemo(
    () => !!fields?.find((f) => f !== field && isConnectionTypeDataField(f) && f.envVar === envVar),
    [fields, field, envVar],
  );

  const isEnvVarValid = !envVar || isValidEnvVar(envVar);

  const isValid = !!fieldType && isPropertiesValid && !!name && !!envVar && isEnvVarValid;

  const newField = fieldType
    ? // Cast from specific type to generic type
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any
      ({
        type: fieldType,
        name,
        description,
        envVar,
        required,
        properties,
      } as ConnectionTypeDataField)
    : undefined;

  const handleSubmit = () => {
    if (isValid) {
      if (newField) {
        onSubmit(prepareFieldForSave(newField));
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen
      variant="medium"
      title={isEdit ? 'Edit field' : 'Add field'}
      onClose={onClose}
      footer={
        <DashboardModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Save' : 'Add'}
          isSubmitDisabled={!isValid}
          alertTitle="Error"
        />
      }
      data-testid="archive-model-version-modal"
      elementToFocus="#name"
    >
      <Form>
        <FormGroup fieldId="name" label="Name" isRequired>
          <TextInput
            id="name"
            value={name}
            onChange={(_ev, value) => {
              setName(value);
              if (autoGenerateEnvVar) {
                setEnvVar(fieldNameToEnvVar(value));
              }
            }}
            data-testid="field-name-input"
          />
        </FormGroup>
        <FormGroup
          fieldId="description"
          label="Description"
          labelHelp={
            <Popover
              aria-label="description help"
              headerContent="Description"
              bodyContent="Use the description to provide users in your organization with additional information about a field, or instructions for completing the field. Your input will appear in a popover, like this one."
            >
              <DashboardPopupIconButton
                icon={<OutlinedQuestionCircleIcon />}
                aria-label="More info for section heading"
              />
            </Popover>
          }
        >
          <TextArea
            id="description"
            data-testid="field-description-input"
            value={description}
            onChange={(_ev, value) => setDescription(value)}
          />
        </FormGroup>
        <FormGroup
          fieldId="envVar"
          label="Environment variable"
          labelHelp={
            <Popover
              aria-label="environment variable help"
              headerContent="Environment variable"
              bodyContent="Environment variables are how the system references the field value in a workbench or model server. Your input will appear in a popover, like this one. "
            >
              <DashboardPopupIconButton
                icon={<OutlinedQuestionCircleIcon />}
                aria-label="More info for section heading"
              />
            </Popover>
          }
          isRequired
        >
          <TextInput
            id="envVar"
            value={envVar}
            onChange={(_ev, value) => {
              if (autoGenerateEnvVar) {
                setAutoGenerateEnvVar(false);
              }
              setEnvVar(value);
            }}
            data-testid="field-env-var-input"
            validated={!isEnvVarValid ? 'error' : isEnvVarConflict ? 'warning' : 'default'}
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                variant={isEnvVarValid ? 'default' : 'error'}
                icon={isEnvVarValid ? undefined : <ExclamationCircleIcon />}
              >
                Valid characters include letters, numbers, and underscores ( _ ), and must not start
                with a number.
              </HelperTextItem>
            </HelperText>
            {isEnvVarConflict ? (
              <HelperText data-testid="envvar-conflict-warning">
                <HelperTextItem icon={<WarningTriangleIcon />} variant="warning">
                  {envVar} already exists within this connection type.
                </HelperTextItem>
              </HelperText>
            ) : undefined}
          </FormHelperText>
        </FormGroup>
        <FormGroup fieldId="fieldType" label="Type" isRequired data-testid="field-type-select">
          <Select
            id="fieldType"
            isOpen={isTypeSelectOpen}
            shouldFocusToggleOnSelect
            selected={fieldType}
            onSelect={(_e, selection) => {
              if (isConnectionTypeFieldType(selection)) {
                setPropertiesValid(true);
                setProperties({});
                setFieldType(selection);
                setIsTypeSelectOpen(false);
              }
            }}
            onOpenChange={(open) => setIsTypeSelectOpen(open)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                id="type-select"
                isFullWidth
                onClick={() => {
                  setIsTypeSelectOpen((open) => !open);
                }}
                isExpanded={isTypeSelectOpen}
              >
                {fieldType ? fieldTypeToString(fieldType) : ''}
              </MenuToggle>
            )}
          >
            <SelectList>
              {connectionTypeDataFields
                .map((value) => ({ label: fieldTypeToString(value), value }))
                .toSorted((a, b) => a.label.localeCompare(b.label))
                .map(({ value, label }) => (
                  <SelectOption key={value} value={value} data-testid={`field-${value}-select`}>
                    {label}
                  </SelectOption>
                ))}
            </SelectList>
          </Select>
        </FormGroup>
        {newField ? (
          <DataFieldPropertiesForm
            field={newField}
            onChange={setProperties}
            onValidate={setPropertiesValid}
          />
        ) : undefined}
        <FormGroup fieldId="isRequired">
          <Checkbox
            id="isRequired"
            data-testid="field-required-checkbox"
            label="Field is required"
            isChecked={required || false}
            onChange={(_ev, checked) => {
              setRequired(checked);
            }}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
