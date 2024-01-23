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
        entityManagerFactoryRef = "persistentEntityManagerFactory",
        transactionManagerRef = "persistentTransactionManager",
        basePackages = {"donation.main.repository"}
)
public class PersistentDataSourceConfig {

    @Primary
    @Bean(name = "persistentDataSource")
    public DataSource accountDataSource(
            @Value("${spring.persistent.datasource.url}") String url,
            @Value("${spring.persistent.datasource.username}") String username,
            @Value("${spring.persistent.datasource.password}") String password,
            @Value("${spring.persistent.datasource.driverClassName}") String driverClassName
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
    @Bean(name = "persistentEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean persistentEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("persistentDataSource") DataSource persistentDataSource
    ) {
        return builder
                .dataSource(persistentDataSource)
                .packages("donation.main.entity")
                .build();
    }

    @Bean(name = "persistentTransactionManager")
    public PlatformTransactionManager mainTransactionManager(
            @Qualifier("persistentEntityManagerFactory")EntityManagerFactory persistentEntityManagerFactory) {
        return new JpaTransactionManager(persistentEntityManagerFactory);
    }
}
