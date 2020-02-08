import debug from 'debug'
import Controller from './Controller'
import ConnectionPool from './ConnectionPool'
import remoteitInstaller from './remoteitInstaller'
import CLIInterface from './CLIInterface'
import environment from './environment'
import ElectronApp from './ElectronApp'
import JSONFile from './JSONFile'
import Logger from './Logger'
import path from 'path'
import user from './User'
import server from './Server'
import Tracker from './Tracker'
import EventBus from './EventBus'

const d = debug('r3:backend:Application')

export default class Application {
  public pool: ConnectionPool
  public cli: CLIInterface
  private controller?: Controller
  private app?: ElectronApp
  private connectionsFile: JSONFile<IConnection[]>

  constructor() {
    Logger.info('Application starting up!')

    this.install()
    this.bindExitHandlers()
    environment.setElevatedState()

    this.connectionsFile = new JSONFile<IConnection[]>(path.join(environment.userPath, 'connections.json'))

    // exit electron start if running headless
    if (!environment.isHeadless) this.app = new ElectronApp()

    // Start pool and load connections from filesystem
    this.pool = new ConnectionPool(this.connectionsFile.read() || [])

    // remoteit CLI init
    this.cli = new CLIInterface()

    // Start server and listen to events
    server.start()

    // create the event controller
    if (server.io) this.controller = new Controller(server.io, this.cli, this.pool)

    EventBus.on(ConnectionPool.EVENTS.updated, this.handlePoolUpdated)
    EventBus.on(user.EVENTS.signedIn, this.startHeartbeat)
    EventBus.on(user.EVENTS.signedOut, this.handleSignedOut)
  }

  private install = async () => {
    const install = !(await remoteitInstaller.isCurrent())
    if (install && this.controller) this.controller.installBinaries()
  }

  private startHeartbeat = () => {
    // start heartbeat 1bpm
    setInterval(this.check, 1000 * 60)
  }

  private check = () => {
    this.app && this.app.check()
    remoteitInstaller.check()
    this.pool.check()
  }

  private bindExitHandlers = () => {
    Tracker.event('app', 'close', 'closing application')
    // Do something when app is closing
    process.on('exit', this.handleException)

    // Catches ctrl+c event
    process.on('SIGINT', this.handleException)

    // Catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', this.handleException)
    process.on('SIGUSR2', this.handleException)
  }

  private handleException = async (code: any) => {
    Logger.warn('PROCESS EXIT', { errorCode: code })
    if (this.pool) await this.pool.stopAll()
    process.exit()
  }

  /**
   * When the pool is updated, persist it to the saved connections
   * file on disk.
   */
  private handlePoolUpdated = (pool: IConnection[]) => {
    d('Pool updated:', pool)
    // Logger.info('Pool updated', { pool })
    this.connectionsFile.write(pool)
  }

  /**
   * When a user logs out, remove their credentials from the
   * saved connections file.
   */
  private handleSignedOut = async () => {
    Logger.info('Signing out user')

    // Stop all connections cleanly
    await this.pool.stopAll()

    // Remove files from system.
    // this.connectionsFile.remove() // Lets keep the connections, unless manually removed.
  }
}
