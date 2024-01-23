package donation.main.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "externalEntityManagerFactory",
        transactionManagerRef = "externalTransactionManager",
        basePackages = {"donation.main.externaldb.repository"}
)
public class ExternalDataSourceConfig {
    @Bean(name = "externalDataSource")
    public DataSource accountDataSource(
            @Value("${spring.external.datasource.url}") String url,
            @Value("${spring.external.datasource.username}") String username,
            @Value("${spring.external.datasource.password}") String password,
            @Value("${spring.external.datasource.driverClassName}") String driverClassName
    ) {
        return DataSourceBuilder
                .create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName(driverClassName)
                .build();
    }

    @Bean(name = "externalEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean externalEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("externalDataSource") DataSource externalDataSource
    ) {
        return builder
                .dataSource(externalDataSource)
                .packages("donation.main.externaldb.entity")
                .build();
    }

    @Bean(name = "externalTransactionManager")
    public PlatformTransactionManager externalTransactionManager(
            @Qualifier("externalEntityManagerFactory")EntityManagerFactory externalEntityManagerFactory) {
        return new JpaTransactionManager(externalEntityManagerFactory);
    }
}
