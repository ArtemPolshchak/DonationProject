package donation.main.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "mainEntityManagerFactory",
        transactionManagerRef = "mainTransactionManager",
        basePackages = {"donation.main.repository"}
)
public class MainDataSourceConfig {

    @Primary
    @Bean(name = "mainDataSource")
    public DataSource accountDataSource(
            @Value("${spring.main.datasource.url}") String url,
            @Value("${spring.main.datasource.username}") String username,
            @Value("${spring.main.datasource.password}") String password,
            @Value("${spring.main.datasource.driverClassName}") String driverClassName
    ) {
        return DataSourceBuilder
                .create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName(driverClassName)
                .build();
    }

    @Primary
    @Bean(name = "mainEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean mainEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("mainDataSource") DataSource mainDataSource
    ) {
        return builder
                .dataSource(mainDataSource)
                .packages("donation.main.entity")
                .build();
    }

    @Bean(name = "persistentTransactionManager")
    public PlatformTransactionManager mainTransactionManager(
            @Qualifier("mainEntityManagerFactory")EntityManagerFactory mainEntityManagerFactory) {
        return new JpaTransactionManager(mainEntityManagerFactory);
    }
}
