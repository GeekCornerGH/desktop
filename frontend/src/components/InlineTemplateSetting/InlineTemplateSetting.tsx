import React from 'react'
import { useSelector } from 'react-redux'
import { InlineTextFieldSetting } from '../InlineTextFieldSetting'
import { ApplicationState } from '../../store'
import { useApplication, Application } from '../../shared/applications'
import { newConnection, setConnection } from '../../helpers/connectionHelper'
import { CopyButton } from '../../buttons/CopyButton'
import { Tooltip } from '@material-ui/core'
import { Icon } from '../Icon'

type Props = { service: IService; connection?: IConnection; context: Application['context'] }

export const InlineTemplateSetting: React.FC<Props> = ({ service, connection, context }) => {
  const freePort = useSelector((state: ApplicationState) => state.backend.freePort)
  if (!connection) connection = newConnection(service, freePort)
  const app = useApplication(context, service, connection)

  return (
    <InlineTextFieldSetting
      value={app.template}
      displayValue={app.command}
      actionIcon={<CopyButton connection={connection} service={service} context={context} show />}
      label={
        <>
          {app.contextTitle}
          <Tooltip title={`Replacement Tokens ${app.tokens}`} placement="top" arrow>
            <Icon name="question-circle" size="sm" type="regular" inline />
          </Tooltip>
        </>
      }
      resetValue={app.template}
      onSave={template =>
        connection &&
        setConnection({
          ...connection,
          [app.templateKey]: template.toString(),
        })
      }
    />
  )
}
