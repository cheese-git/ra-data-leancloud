class Config {
  AV: AVInterface
  debug: boolean

  init({ AV, debug }: InitOptions) {
    this.AV = AV
    this.debug = debug
  }
}

const config = new Config()

export default config
