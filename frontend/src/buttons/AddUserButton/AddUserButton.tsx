import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { IconButton, Tooltip } from '@material-ui/core'
import { Icon } from '../../components/Icon'

export const AddUserButton: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const onClick = () => history.push(`${location.pathname.replace('/users', '')}/users/share`)

  return (
    <Tooltip title="Share">
      <IconButton onClick={onClick}>
        <Icon name="user-plus" size="md" type="light" />
      </IconButton>
    </Tooltip>
  )
}