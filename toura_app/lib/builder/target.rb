module Builder
  class Target
    attr_reader :config

    def initialize(target_name, build_targets_dir, logger)
      target_file = File.join(build_targets_dir, "#{target_name}.yml")
      logger.info("Builder::Target current directory: #{FileUtils.pwd}") if logger
      if !File.exists?(target_file)
        logger.info("Builder::Target target_file: #{target_file} does not exist.") if logger
        @config = false
      else
        logger.info("Builder::Target loading target_file: #{target_file}.") if logger
        @config = YAML.load_file(target_file)
      end
    end
  end
end
