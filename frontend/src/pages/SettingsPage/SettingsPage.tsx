import React from 'react'
import { PageHeading } from '../../components/PageHeading'
import { SignOutLinkController } from '../../controllers/SignOutLinkController'
import { QuitLinkController } from '../../controllers/QuitLinkController'
import { Link, Button } from '@material-ui/core'
import { Icon } from '../../components/Icon'
import { Body } from '../../components/Body'
import { SearchOnlyToggle } from '../../components/SearchOnlyToggle'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'

export type SettingsPageProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>

const mapState = (state: ApplicationState, props: any) => ({
  installing: state.binaries.installing,
  installed:
    state.binaries.connectdInstalled &&
    state.binaries.muxerInstalled &&
    state.binaries.demuxerInstalled,
  // connectdInstalled: state.binaries.connectdInstalled,
  // connectdPath: state.binaries.connectdPath,
  // connectdVersion: state.binaries.connectdVersion,
  // muxerInstalled: state.binaries.muxerInstalled,
  // muxerPath: state.binaries.muxerPath,
  // muxerVersion: state.binaries.muxerVersion,
  // demuxerInstalled: state.binaries.demuxerInstalled,
  // demuxerPath: state.binaries.demuxerPath,
  // demuxerVersion: state.binaries.demuxerVersion,
})

const mapDispatch = (dispatch: any) => ({
  install: dispatch.binaries.install,
})

export const SettingsPage = connect(
  mapState,
  mapDispatch
)(({ installing, installed, install }: SettingsPageProps) => {
  return (
    <div className="bg-grey px-md">
      <PageHeading className="my-md">Settings</PageHeading>
      <div className="bg-white rad-sm py-sm my-md">
        <SignOutLinkController />
        <Link
          href={encodeURI(
            `mailto:support@remote.it?subject=Desktop Application Feedback`
          )}
        >
          <Icon name="envelope" className="mr-sm" />
          Send feedback
        </Link>
        <QuitLinkController />
      </div>
      <div className="bg-white rad-sm p-md my-md">
        <SearchOnlyToggle />
      </div>
      <div className="bg-white rad-sm p-md my-md">
        {/*
          <div className="df ai-center mb-xs">
            <h3 className="my-none txt-md">
              connectd
            </h3>
            {connectdPath && (
              <pre className="ml-auto my-none">{connectdPath}</pre>
            )}
          </div>
          <div className="df ai-center mb-xs">
            <h3 className="my-none txt-md">
              muxer
            </h3>
            {muxerPath && <pre className="ml-auto my-none">{muxerPath}</pre>}
          </div>
          <div className="df ai-center mb-xs">
            <h3 className="my-none txt-md">
              demuxer
            </h3>
            {demuxerPath && (
              <pre className="ml-auto my-none">{demuxerPath}</pre>
            )}
          </div>
          */}
        <div className="">
          <Button
            disabled={installing}
            onClick={() => install()}
            variant="contained"
            color={installed ? 'default' : 'primary'}
          >
            {installing ? (
              'Installing...'
            ) : (
              <>{installed ? 'Reinstall' : 'Install'} command line tools</>
            )}
          </Button>
        </div>
        <div className="mt-md txt-sm gray">
          Installing command line tools requires administrator permissions.
        </div>
      </div>
    </div>
  )
})
